const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const User = require('../models/user');
const Community = require('../models/community');
const Community_Exercise = require('../models/community_exercise');
const Community_Set = require('../models/community_set');

//전체 커뮤니티
const allCommunities = async (req, res) => {
  try {
    const { userId, exerciseName } = req.query;

    let where;
    if (exerciseName) {
      const exercise = await Community.findAll({
        attributes: ['id'],
        include: [
          {
            model: Community_Exercise,
            attributes: ['id'],
            as: 'myExercise',
            where: Sequelize.literal(
              `myExercise.exerciseName LIKE '%${exerciseName}%'`
            ),
          },
        ],
      });
      const exerciseIds = [];
      for (let i = 0; i < exercise.length; i++) {
        exerciseIds.push(exercise[i].id);
      }
      where = Sequelize.literal(`Community.id IN (${exerciseIds.join(',')})`);
    } else {
      where = {};
    }
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
      where,
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
};

//커뮤니티 상세
const communityDetail = async (req, res) => {
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
};

//커뮤니티 등록
const communityEnroll = async (req, res) => {
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
};

const communityDelete = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const communityId = req.params.routineId;
    const community = await Community.findOne({
      where: { id: communityId },
    });

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
};

module.exports = {
  allCommunities,
  communityDetail,
  communityEnroll,
  communityDelete,
};
