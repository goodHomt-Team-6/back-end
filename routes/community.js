const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const User = require('../models/user');
const Community = require('../models/community');
const Community_Exercise = require('../models/community_exercise');
const Community_Set = require('../models/community_set');
const Like_User = require('../models/like_user');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//커뮤니티 루틴 등록
router.post('/', authenticateJWT, async (req, res) => {
  //서비스
  try {
    const { routineName, myExercise, description, routineTime, isBookmarked } =
      req.body;
    const userId = req.userInfo.id;
    const communityNickname =
      req.body.communityNickname || req.userInfo?.communityNickname;
    if (!userId) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (userId) {
      const community = await Community.create({
        userId,
        routineName,
        description,
        routineTime,
        isBookmarked,
        communityNickname,
      });
      for (let i = 0; i < myExercise.length; i++) {
        const { exerciseName, set } = myExercise[i];
        const communityExercise = await Community_Exercise.create({
          communityId: community.id,
          exerciseName,
        });
        for (let i = 0; i < set.length; i++) {
          const inputSet = set[i];
          await Community_Set.create({
            communityExerciseId: communityExercise.id,
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

      if (!req.userInfo?.communityNickname) {
        await User.update(
          { communityNickname },
          {
            where: { id: userId },
          }
        );
        res.status(200).send({ message: 'success' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// 커뮤니티 루틴 전부 가져오기
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    // let where;
    // if (exerciseName) {
    //   where = Sequelize.literal(
    //     `Community_Exercise.exerciseName LIKE '%${exerciseName}%'`
    //   );
    // } else {
    //   where = {};
    // };
    const result = await Community.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
                    SELECT COUNT(userId)
                      FROM like_user AS like_user
                     WHERE
                        like_user.communityId = community.id
                )`),
            'totalCount',
          ],
          [
            sequelize.literal(`(
                    SELECT COUNT(userId)
                      FROM like_user AS like_user
                     WHERE
                        like_user.communityId = community.id
                )`),
            'isLiked',
          ],
        ],
      },
      include: [
        {
          model: User,
          attributes: ['img'],
        },
        {
          model: Community_Exercise,
          as: 'myExercise',
          include: [
            {
              model: Community_Set,
            },
          ],
        },
      ],
    });
    // for (let i = 0; i < communityLists.length; i++) {
    //   const community = communityLists[i];
    //   const {
    //     routineName,
    //     description,
    //     myExercise,
    //     userId,
    //     routineTime,
    //     isLike,
    //     totalLike,
    //   } = community;
    //   console.log(community.routineName);
    //   // console.log(i, community[i]);
    // }

    // const result = await Community.find({
    //   'myExercise.exerciseName': { $regex: `${exerciseName}`, $options: 'i' },
    // });
    // result.forEach((routine) => {
    //   routine.totalLike = routine.like.length;
    //   const likeUser = [];
    //   routine.like.forEach((like) => likeUser.push(like.userId));
    //   const isLike = likeUser.includes(Number(userId));
    //   routine.isLike = isLike;
    //   routine.importCnt = routine.import.length;
    //   routine.import = null;
    //   routine.like = null;
    // });

    //totalLike,
    res.status(200).send({ message: 'success', communityLists });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// //커뮤니티 루틴 디테일 가져오기
// router.get('/:routineId', async (req, res) => {
//   try {
//     const result = await Community.findById(req.params.routineId);
//     result.totalLike = result.like.length;
//     result.import = null;
//     result.like = null;
//     res.status(200).send({ message: 'success', result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// });

// //커뮤니티 루틴 삭제하기
// //authenticateJWT
// router.delete('/:routineId', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.userInfo.id;
//     const routine = await Community.findById(req.params.routineId);

//     if (!req.userInfo.id) {
//       res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
//       return;
//     }
//     if (Number(userId) !== routine.userId) {
//       res.status(500).json({ errorMessage: '사용자가 일치하지 않습니다.' });
//       return;
//     }
//     if (Number(userId) === routine.userId) {
//       await Community.findByIdAndDelete(req.params.routineId);
//       res.status(200).send({ message: 'success' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// });

// //커뮤니티 루틴에서 나의루틴으로 가져오기
// //authenticateJWT
// router.post('/:routineId', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.userInfo.id;
//     const { myExercise, routineName } = req.body;

//     if (myExercise) {
//       const routine = await Routine.create({
//         userId,
//         routineName,
//       });
//       for (let i = 0; i < myExercise.length; i++) {
//         const { exerciseName, set } = myExercise[i];
//         const routineExercise = await Routine_Exercise.create({
//           routineId: routine.id,
//           exerciseName,
//         });

//         for (let i = 0; i < set.length; i++) {
//           const inputSet = set[i];
//           await Set.create({
//             routineExerciseId: routineExercise.id,
//             weight: inputSet?.weight,
//             count: inputSet?.count,
//             time: inputSet?.time,
//             type: inputSet?.type,
//             setCount: inputSet?.setCount,
//             minutes: inputSet?.minutes,
//             seconds: inputSet?.seconds,
//             order: i + 1,
//           });
//         }
//       }
//       await Community.findByIdAndUpdate(req.params.routineId, {
//         $push: { import: { userId } },
//       });
//       res.status(200).send({ ok: true });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ errorMessage: error });
//   }
// });

module.exports = router;
