const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { authenticateJWT } = require('../middlewares/authenticateJWT');
const Challenge = require('../models/challenge');
const Challenge_User = require('../models/challenge_user');
const Challenge_Exercise = require('../models/challenge_exercise');
const Challenge_Set = require('../models/challenge_set');

const { find } = require('../utils/challenge');
const { sequelize } = require('../models');

//챌린지 가져오기
router.get('/', async (req, res) => {
  try {
    const result = await Challenge.findAll(find({ progressStatus: 'start' }));
    res.status(200).json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//사용자별 참가전 챌린지 가져오기
router.get('/user', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  try {
    const result = await Challenge_User.findAll({
      where: { userId },
      include: {
        model: Challenge,
        attributes: [
          'challengeName',
          'challengeIntroduce',
          'challengeDateTime',
          'progressStatus',
        ],
        where: { progressStatus: 'start' },
      },
      order: [['createdAt'], ['DESC']],
    });
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//사용자별 참가후 챌린지 가져오기
router.get('/user/end', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  try {
    const result = await Challenge_User.findAll({
      where: { userId },
      include: {
        model: Challenge,
        attributes: [
          'challengeName',
          'challengeIntroduce',
          'challengeDateTime',
          'progressStatus',
        ],
        where: { progressStatus: 'end' },
      },
      order: [['createdAt'], ['DESC']],
    });
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//챌린지별 상세 데이터 가져오기
router.get('/:challengeId', async (req, res) => {
  const { challengeId } = req.params;
  try {
    const userCount = await Challenge_User.findOne({
      where: { challengeId },
      attributes: {
        include: [[sequelize.fn('count', sequelize.col('challengeId')), 'cnt']],
      },
      group: ['challengeId'],
    });

    const challenge = await Challenge.findOne(find({ id: challengeId }));

    let cnt = userCount === null ? 0 : userCount.cnt;
    res.status(200).json({ ok: true, result: { challenge, userCount: cnt } });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//챌린지 등록하기
router.post('/', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  try {
    const { challengeName, challengeIntroduce, challengeDateTime, exercises } =
      req.body;

    if (exercises) {
      const challenge = await Challenge.create({
        userId,
        challengeName,
        challengeIntroduce,
        challengeDateTime,
      });
      for (let i = 0; i < exercises.length; i++) {
        const { exerciseName, set } = exercises[i];
        const challengeExercise = await Challenge_Exercise.create({
          challengeId: challenge.id,
          exerciseName,
        });

        for (let i = 0; i < set.length; i++) {
          const inputSet = set[i];
          await Challenge_Set.create({
            challengeExerciseId: challengeExercise.id,
            weight: inputSet?.weight,
            count: inputSet?.count,
            time: inputSet?.time,
            type: inputSet?.type,
            setCount: inputSet?.setCount,
            minutes: inputSet?.minutes,
            seconds: inputSet?.seconds,
            order: i + 1,
          });
        }
      }
    }
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//챌린지 참여 취소하기
router.post('/', async (req, res) => {});

//챌린지 참여인원

//챌린지 기록하기
module.exports = router;
