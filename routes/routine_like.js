const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const User = require('../models/user');

//Like등록 || 삭제
router.put('/:id', async (req, res) => {
  const userEmail = res.locals.user.email;
  const routine = await Community_Routine.findById(req.params.id);
  const likeUser = routine.comment.userEmail(userEmail);
  try {
    if (!res.locals.user) {
      res.status(400).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (!likeUser) {
      await routine.findByIdAndUpdate(req.params.id, {
        $push: { like: { userEmail } },
      });
      res.status(200).send({ message: 'success' });
    }
    if (likeUser) {
      await routine.findByIdAndUpdate(req.params.id, {
        $pull: { like: { userEmail: userEmail } },
      });
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {}
});

//Like등록
// router.post('/:id', async (req, res) => {
//   const { user_id } = req.body;

//   try {
//     const user = await User.findOne({
//       where: { id: user_id },
//     });

//     await Community_Routine.findByIdAndUpdate(req.params.id, {
//       $push: { like: { user } },
//     });
//     res.status(200).send({ message: 'success' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error);
//   }
// });

//Like삭제
// router.delete('/:id', async (req, res) => {
//   const { like_id } = req.body;
//   try {
//     await Community_Routine.findByIdAndUpdate(req.params.id, {
//       $pull: { like: { _id: like_id } },
//     });
//     res.status(200).send({ message: 'success' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error);
//   }
// });

// module.exports = router;
