const express = require('express');
const router = express.Router();
const Challenge = require('../mongoose_models/challenge');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//챌린지 가져오기
router.get('/', async (req, res) => {
  try {
    const result = await Challenge.find();
    res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//참가 유저 추가 || 삭제
router.put('/users/:challegenId', authenticateJWT, async (req, res) => {});

//챌린지 참여 인원
router.get('/users', async (req, res) => {});

//챌린지 기록하기
router.post('/', async (req, res) => {});

module.exports = router;
