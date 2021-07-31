const express = require('express');
const router = express.Router();
const Routine_Comment = require('../mongoose_models/routine_comment');
const Community_Routine = require('../mongoose_models/community_routine');
const User = require('../models/user');

//댓글등록
router.post('/:id', async (req, res) => {
  const { user_id, comment } = req.body;

  try {
    const user = await User.findOne({
      where: { id: user_id },
    });

    await Community_Routine.findByIdAndUpdate(req.params.id, {
      $push: {
        comment: {
          user,
          comment,
        },
      },
    });
    res.status(200).send({});
  } catch (error) {
    console.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
