const { Op } = require('sequelize');
const Challenge = require('../models/challenge');
const Challenge_User = require('../models/challenge_user');
const Challenge_Exercise = require('../models/challenge_exercise');
const Challenge_Set = require('../models/challenge_set');
const User = require('../models/user');
const { allSearch, find, getDeadLineYn } = require('../utils/challenge');
const { sequelize } = require('../models');
//전체 챌린지
exports.allChallenge = async (req, res) => {
  try {
    const result = await Challenge.findAll(
      find({
        challengeDateTime: {
          [Op.gt]: sequelize.literal(
            `(SELECT date_format(NOW(), '%Y%m%d%H%i'))`
          ),
        },
      })
    );
    // const result = await allSearch();
    res.status(200).json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.challengeForUserBeforeJoin = async (req, res) => {
  const userId = req.userId;

  //메인에서 챌린지가져올 떄 쓸 조건 => 메인 api 작성후 적용
  const where = {
    challengeDateTime: {
      [Op.gt]: sequelize.literal(
        `(SELECT date_format(DATE_SUB(NOW(), INTERVAL Challenge.runningTime MINUTE), '%Y%m%d%H%i'))`
      ),
    },
  };
  try {
    const result = await Challenge_User.findAll({
      where: { userId },
      include: {
        model: Challenge,
        as: 'Challenge',
        attributes: [
          'challengeName',
          'challengeIntroduce',
          'challengeDateTime',
          'communityNickname',
          'progressStatus',
        ],
        where,
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.challengeForUserAfterJoin = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await Challenge_User.findAll({
      where: { userId },
      include: {
        model: Challenge,
        as: 'Challenge',
        attributes: [
          'challengeName',
          'challengeIntroduce',
          'challengeDateTime',
          'communityNickname',
          'progressStatus',
        ],
        where: { progressStatus: 'end' },
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

//챌린지별 상세 데이터 가져오기
exports.getChallengeDetail = async (req, res) => {
  const { challengeId } = req.params;
  try {
    const challenge = await Challenge.findOne(find({ id: challengeId }));
    res.status(200).json({ ok: true, result: { challenge } });
  } catch (error) {
    console.error('error!@#!@#', error);
    res.status(500).json(error);
  }
};

//챌린지 등록하기
exports.makeChallenge = async (req, res) => {
  const userId = req.userId;
  try {
    const {
      challengeName,
      challengeIntroduce,
      challengeDateTime,
      exercises,
      communityNickname,
      runningTime,
      difficulty,
    } = req.body;
    if (exercises) {
      const challenge = await Challenge.create({
        userId,
        challengeName,
        challengeIntroduce,
        challengeDateTime,
        communityNickname,
        runningTime,
        difficulty,
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
};

//챌린지 기록하기
exports.makeRecord = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);
    await User.update(
      {
        stamp: user.stamp + 1,
      },
      {
        where: { id: userId },
      }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
};

//챌린지 참여하기
exports.joinChallenge = async (req, res) => {
  const userId = req.userId;
  const { challengeId } = req.params;

  try {
    const status = await getDeadLineYn(challengeId);
    if (status === 'end') {
      return res
        .status(400)
        .json({ ok: false, message: '마감 된 챌린지입니다.' });
    }

    const exist = await Challenge_User.findOne({
      where: {
        [Op.and]: [{ challengeId }, { userId }],
      },
    });
    if (exist) {
      return res.json({
        ok: false,
        message: '이미 해당 챌린지에 참가신청 한 사용자 입니다.',
      });
    }
    await Challenge_User.create({
      challengeId,
      userId,
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
};

//챌린지 참여 취소하기
exports.cancelChallenge = async (req, res) => {
  const userId = req.userId;
  const { challengeId } = req.params;

  try {
    const status = await getDeadLineYn(challengeId);
    if (status === 'end') {
      return res.json({ ok: false, message: '마감 된 챌린지입니다.' });
    }
    await Challenge_User.destroy({
      where: {
        [Op.and]: [{ challengeId }, { userId }],
      },
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
};
