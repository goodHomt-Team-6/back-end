const express = require('express');
const router = express.Router();
const Community = require('../mongoose_models/community');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//댓글등록
router.post('/:routineId', authenticateJWT, async (req, res) => {
  const { comment } = req.body;
  const userId = req.userInfo.id;
  const nickname = req.userInfo.nickname;

  try {
    if (!req.userInfo) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (req.userInfo) {
      await Community.findByIdAndUpdate(req.params.routineId, {
        $push: { comment: { userId, comment, nickname } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//댓글삭제
router.delete('/:routineId', authenticateJWT, async (req, res) => {
  const userId = req.userInfo.id;
  const routine = await Community.findById(req.params.routineId);

  try {
    if (!req.userInfo.id) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (userId !== routine.userId) {
      res.status(500).json({ errorMessage: '사용자가 일치하지 않습니다.' });
      return;
    }

    if (userId === routine.userId) {
      await Community.findByIdAndUpdate(req.params.routineId, {
        $pull: { comment: { userId: userId } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
