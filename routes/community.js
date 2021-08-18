const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const User = require('../models/user');
const Community = require('../models/community');
const Community_Exercise = require('../models/community_exercise');
const Community_Set = require('../models/community_set');

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
                        like_user.communityId = Community.id
                )`),
            'totalLike',
          ],
          [
            sequelize.literal(`(
                    SELECT IF( COUNT(userId) > 0, true, false) as isLiked
                      FROM like_user AS like_user
                     WHERE
                        like_user.communityId = Community.id and like_user.userId = ${userId}
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
          attributes: ['exerciseName'],
          as: 'myExercise',
          // include: [
          //   {
          //     model: Community_Set,
          //     as: 'set',
          //   },
          // ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// //커뮤니티 루틴 디테일 가져오기
router.get('/:routineId', async (req, res) => {
  const routineId = req.params.routineId;
  try {
    const result = await Community.findOne({
      where: { id: routineId },
      // attributes: {
      //   include: [
      //     [
      //       sequelize.literal(`(
      //               SELECT COUNT(userId)
      //                 FROM like_user AS like_user
      //                WHERE
      //                   like_user.communityId = community.id
      //           )`),
      //       'totalLike',
      //     ],
      //   ],
      // },
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
              as: 'set',
            },
          ],
        },
      ],
    });
    res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//dupcheck
router.post('/dupCheck', async (req, res) => {
  try {
    const { communityNickname } = req.body;
    const exist = await User.findOne({
      where: { communityNickname },
    });
    if (exist)
      return res
        .status(401)
        .json({ ok: false, message: '이미 있는 닉네임입니다' });
    else return res.json({ ok: true, message: '닉네임을 추가했습니다' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false });
  }
});

// //커뮤니티 루틴 삭제하기
router.delete('/:routineId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const communityId = req.params.routineId;
    const community = await Community.findOne({
      where: { id: communityId },
    });
    console.log('community!!', community);
    if (+userId !== community.userId) {
      res.status(500).json({ errorMessage: '사용자가 일치하지 않습니다.' });
      return;
    }
    await Community.destroy({
      where: { id: communityId },
    });
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

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
