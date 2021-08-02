const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//댓글등록
router.post('/', authenticateJWT, async (req, res) => {
  const { comment } = req.body;
  const userEmail = req.loginUser.user.email;

  try {
    if (!req.loginUser.user) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (req.loginUser.user) {
      await Community_Routine.findByIdAndUpdate(req.params.id, {
        $push: { comment: { userEmail, comment } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//댓글삭제
router.delete('/:id', authenticateJWT, async (req, res) => {
  const userEmail = req.loginUser.user.email;
  const routine = await Community_Routine.findById(req.params.id);

  try {
    if (!req.loginUser.user) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (userEmail !== routine.userEmail) {
      res.status(500).json({ errorMessage: '사용자가 일치하지 않습니다.' });
      return;
    }

    if (userEmail === routine.userEmail) {
      await Community_Routine.findByIdAndUpdate(req.params.id, {
        $pull: { comment: { userEmail: userEmail } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
