const Sequelize = require('sequelize');
const {
  sequelize,
  Category,
  Default_Exercise,
  User,
  Community,
  Community_Exercise,
  Community_Set,
} = require('../models');
const { getOrSetCache, deleteCacheById } = require('../utils/cache');

//전체 커뮤니티
const allCommunities = async (req, res) => {
  try {
    const { userId, exerciseName } = req.query;
    let where;
    if (exerciseName) {
      const cachingWhere = await getOrSetCache(
        `communiy-${exerciseName}`,
        async () => {
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
          return `Community.id IN (${exerciseIds.join(',')})`;
        }
      );
      where = cachingWhere;
    } else {
      where = '';
    }
    const result = await getOrSetCache(
      `allCommunity-${userId}-${exerciseName}`,
      async () => {
        const communities = await Community.findAll({
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
          where: Sequelize.literal(where),
          include: [
            {
              model: User,
              attributes: ['img'],
            },
            {
              model: Community_Exercise,
              attributes: ['exerciseName'],
              as: 'myExercise',
              include: [
                {
                  model: Category,
                  attributes: ['id', 'categoryName'],
                },
              ],
            },
          ],
          order: [['createdAt', 'DESC']],
        });
        return communities;
      }
    );

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
    const result = await getOrSetCache(
      `communityDetail-${routineId}`,
      async () => {
        const community = await Community.findOne({
          where: { id: routineId },
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
        return community;
      }
    );
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

    const userId = req.userId;
    const communityNickname =
      req.body.communityNickname || req.userInfo?.communityNickname;

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

        await deleteCacheById(`allCommunity-${userId}-${exerciseName}`);
        await deleteCacheById(`allCommunity-${userId}-undefined`);

        const category = await getOrSetCache(
          `categoryForExercise-${exerciseName}`,
          async () => {
            const cachingCategory = await Category.findOne({
              attributes: ['id'],
              include: [
                {
                  model: Default_Exercise,
                  as: 'exerciseList',
                  where: { exerciseName },
                },
              ],
            });
            return cachingCategory;
          }
        );
        const communityExercise = await Community_Exercise.create({
          communityId: community.id,
          exerciseName,
          categoryId: category.id,
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
    const userId = req.userId;
    const communityId = req.params.routineId;
    const community = await Community.findOne({
      where: { id: communityId },
    });
    const exercise = await Community_Exercise.findAll({
      attributes: ['exerciseName'],
      where: { communityId },
    });

    for (let i = 0; i < exercise.length; i++) {
      const { exerciseName } = exercise[i];
      await deleteCacheById(`allCommunity-${userId}-${exerciseName}`);
    }
    await deleteCacheById(`allCommunity-${userId}-undefined`);
    await deleteCacheById(`communityDetail-${communityId}`);

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

const dupCheckNickname = async (req, res) => {
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
};

module.exports = {
  allCommunities,
  communityDetail,
  communityEnroll,
  communityDelete,
  dupCheckNickname,
};
