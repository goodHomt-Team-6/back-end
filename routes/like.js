const express = require('express');
const router = express.Router();
const Community = require('../mongoose_models/community');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//Like등록 || 삭제
// authenticateJWT
router.put('/:routineId', authenticateJWT, async (req, res) => {
  const userId = req.userInfo.id;
  const nickname = req.userInfo.nickname;
  const routine = await Community.findById(req.params.routineId);

  const likeUser = [];
  routine.like.forEach((like) => likeUser.push(like.userId));
  likeUser.includes(Number(userId));

  try {
    if (!req.userInfo) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (likeUser.includes(Number(userId)) == false) {
      await Community.findByIdAndUpdate(req.params.routineId, {
        $push: { like: { nickname, userId } },
      });
      res.status(200).send({ message: 'success' });
    }
    if (likeUser.includes(Number(userId)) == true) {
      await Community.findByIdAndUpdate(req.params.routineId, {
        $pull: { like: { userId: userId } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
