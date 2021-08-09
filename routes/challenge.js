const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Challenge = require('../models/challenge');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const Challenge_User = require('../models/challenge_user');
const { find } = require('../utils/challenge');

//챌린지 가져오기
router.get('/', async (req, res) => {
  try {
    const result = await Challenge.findAll(find({}));
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

//챌린지 참여하기
router.get('/users', async (req, res) => {});

//챌린지 참여 취소하기
router.post('/', async (req, res) => {});

//챌린지 참여인원

//챌린지 기록하기
module.exports = router;
