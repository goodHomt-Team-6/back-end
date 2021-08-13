const express = require('express');
const router = express.Router();
const Community = require('../mongoose_models/community');
const Routine = require('../models/routine');
const Routine_Exercise = require('../models/routine_exercise');
const Set = require('../models/set');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//커뮤니티 루틴 등록
// authenticateJWT
router.post('/', authenticateJWT, async (req, res) => {
  //테스트
  // const {
  //   routineName,
  //   myExercise,
  //   description,
  //   userId,
  //   communityNickname,
  //   isBookmarked,
  //   routineTime,
  // } = req.body;

  // const cr = new Community({
  //   routineName,
  //   myExercise,
  //   description,
  //   userId,
  //   communityNickname,
  //   isBookmarked,
  //   routineTime,
  // });
  // await cr.save();
  // res.status(200).send({ message: 'success' });

  //서비스
  const { routineName, myExercise, description } = req.body;
  const userId = req.userInfo.id;
  const communityNickname = req.userInfo.communityNickname;
  const img = req.userInfo.img;

  try {
    if (!userId) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (userId) {
      const cr = new Community({
        routineName,
        myExercise,
        description,
        userId,
        communityNickname,
        img,
      });
      await cr.save();
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//커뮤니티 루틴 전부 가져오기
router.get('/', async (req, res) => {
  const exerciseName = req.query.exerciseName;
  try {
    if (exerciseName) {
      const result = await Community.find({
        'myExercise.exerciseName': { $regex: `${exerciseName}`, $options: 'i' },
      });
      result.forEach((routine) => {
        routine.totalLike = routine.like.length;
        const likeUser = [];
        routine.like.forEach((like) => likeUser.push(like.userId));
        const isLike = likeUser.includes(Number(req.body?.userId));
        routine.isLike = isLike;
        routine.importCnt = routine.import.length;
        routine.import = null;
        routine.like = null;
      });
      res.status(200).send({ message: 'success', result });
    } else {
      const result = await Community.find().sort('-createdAt');
      result.forEach((routine) => {
        routine.totalLike = routine.like.length;
        const likeUser = [];
        routine.like.forEach((like) => likeUser.push(like.userId));
        const isLike = likeUser.includes(Number(req.body?.userId));
        routine.isLike = isLike;
        routine.importCnt = routine.import.length;
        routine.import = null;
        routine.like = null;
        routine.comment = null;
      });
      res.status(200).send({ message: 'success', result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//커뮤니티 루틴 디테일 가져오기
router.get('/:routineId', async (req, res) => {
  try {
    const result = await Community.findById(req.params.routineId);
    result.totalLike = result.like.length;
    result.import = null;
    result.like = null;
    res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//커뮤니티 루틴 삭제하기
router.delete('/:routineId', authenticateJWT, async (req, res) => {
  const userId = req.userInfo.id;
  const routine = await Community.findById(req.params.routineId);
  try {
    if (!req.loginUser.user) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (userId !== routine.userId) {
      res.status(500).json({ errorMessage: '사용자가 일치하지 않습니다.' });
      return;
    }
    if (userId === routine.userId) {
      await Community.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//커뮤니티 루틴에서 나의루틴으로 가져오기
//authenticateJWT
router.post('/:routineId', authenticateJWT, async (req, res) => {
  const userId = req.userInfo.id;
  const { myExercise, routineName } = req.body;

  try {
    if (myExercise) {
      const routine = await Routine.create({
        userId,
        routineName,
      });
      for (let i = 0; i < myExercise.length; i++) {
        const { exerciseName, set } = myExercise[i];
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
      await Community.findByIdAndUpdate(req.params.routineId, {
        $push: { import: { userId } },
      });
      res.status(200).send({ ok: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

module.exports = router;
