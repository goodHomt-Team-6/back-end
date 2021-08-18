const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Community = require('../models/community');
const User = require('../models/user');
const Community_Exercise = require('../models/community_exercise');
const Community_Set = require('../models/community_set');
const Like_User = require('../models/like_user');
const Routine = require('../models/routine');
const Set = require('../models/set');
const Routine_Exercise = require('../models/routine_exercise');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//커뮤니티에 내 Routine공유
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { myExercise, description } = req.body;
    const userId = req.userId;
    const communityNickname = req.userInfo.nickname;
    const routineName = `${myExercise[0]['exerciseName']} ${
      myExercise.length > 1 ? '외 ' + (myExercise.length - 1) + '개' : ''
    }`;
    if (myExercise) {
      const community = await Community.create({
        userId,
        routineName,
        description,
        communityNickname,
      }); 
      //like 어떻게 처리?
      for (let i = 0; i < myExercise.length; i++) {
        const { exerciseName, set } = myExercise[i];
        const communityExercise = await Community_Exercise.create({
          communityId: community.id,
          exerciseName,
        });
        for (let i = 0; i < set.length; i++) {
          const inputSet = set[i];
          await Set.create({
            communityExerciseId: communityExercise.id,
            setCount: inputSet?.setCount,
            weight: inputSet?.weight,
            count: inputSet?.count,
            minutes: inputSet?.minutes,
            seconds: inputSet?.seconds,
            time: inputSet?.time,
            type: inputSet?.type,
            order: i + 1,
          }); //2번째 for
        } //1번째 for
      } //if
    }
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error })
  }
});

//커뮤니티 루틴 전부 가져오기
router.get('/', async (req, res) => {
  const userId = req.userId;
  const params = req.query;
  let where;
  try {
    const result = await Community.findAll({ 
      where: {
        [Op.and]: [{ userId }, where],
      },
      attributes: [
        'id',
        'routineName',
        'description',
        'communityNickname',
        'createdAt',
      ],
      include: [
        {
          model: Community_Exercise,
          attributes: ['id', 'exerciseName'],
          include:[
            {
              model: Community_Set,
            },
          ],
        },
      ], //include
      order: [['createdAt', 'DESC']],
    }); //result
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  } //try구문
});

//커뮤니티 루틴 디테일 가져오기
router.get('/:communityId', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const id = req.userId;
  try {
    const result = await Community.findAll({
      attributes: [
       id,

    }); //result  
    res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}); //end

//커뮤니티 루틴 삭제하기
//authenticateJWT
router.delete('/:communityId', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const { communityId } = req.params;

  try {
    const community = await Community.findOne({
      where: { id: communityId },
    });

    if (userId !== community.userId) {
      return res.json({ ok: false, message: '권한이 없습니다' });
    }
    await Community.destroy({
      where: { id: communityId },
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//커뮤니티 루틴에서 나의루틴으로 가져오기
//authenticateJWT
router.post('/:communityId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { community } = req.body;
    const routineName = `${community[0]['exerciseName']} ${
      community.length > 1 ? '외 ' + (community.length - 1) + '개' : ''
    }`;

    if (community) {
      const routine = await Routine.create({
        userId,
        routineName,
      });
      for (let i = 0; i < community.length; i++) {
        const { exerciseName, set } = community[i];
        const routineExercise = await Routine_Exercise.create({
          routineId: routine.id,
          exerciseName,
        });

        for (let i = 0; i < set.length; i++) {
          const inputSet = set[i];
          await Set.create({
            routineExerciseId: routineExercise.id,
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
    }
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});
module.exports = router;