const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const User = require('../models/user');

//댓글등록
router.post('/', async (req, res) => {
  const { user_id, comment } = req.body;

  try {
    const user = await User.findOne({
      where: { id: user_id },
    });

    await Community_Routine.findByIdAndUpdate(req.params.id, {
      $push: { comment: { user, comment } },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

//댓글삭제
router.delete('/:id', async (req, res) => {
  const { comment_id } = req.body;

  try {
    await Community_Routine.findByIdAndUpdate(req.params.id, {
      $pull: { comment: { _id: comment_id } },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
