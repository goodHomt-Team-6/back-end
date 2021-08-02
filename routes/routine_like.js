const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//Like등록 || 삭제
router.put('/:id', authenticateJWT, async (req, res) => {
  const userEmail = req.loginUser.user.email;
  const routine = await Community_Routine.findById(req.params.id);
  const likeUser = routine.comment.userEmail(userEmail);
  try {
    if (!req.loginUser.user) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (!likeUser) {
      res.status(500).send({ message: '사용자가 일치하지 않습니다' });
    }
    if (likeUser) {
      await routine.findByIdAndUpdate(req.params.id, {
        $pull: { like: { userEmail: userEmail } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
