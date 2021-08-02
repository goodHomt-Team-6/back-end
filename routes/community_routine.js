const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const User = require('../models/user');

//커뮤니티 루틴 등록
router.post('/', async (req, res) => {
  // const {
  //   routine: {
  //     routineName,
  //     routine_id,
  //     myExercise: { exerciseName, set },
  //     user_id,
  //   },
  // } = req.body;

  const { routineName, routine_id, exerciseName, set, user } = req.body;

  try {
    // const user = await User.findOne({
    //   where: { id: user_id },
    // });

    const cr = new Community_Routine({
      routineName,
      routine_id,
      exerciseName,
      set,
      user,
    });
    await cr.save();
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

//커뮤니티 루틴 전부 가져오기
router.get('/', async (req, res) => {
  try {
    const result = await Community_Routine.find();
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

//커뮤니티 루틴 디테일 가져오기
router.get('/:id', async (req, res) => {
  try {
    const result = await Community_Routine.findById(req.params.id);
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

//커뮤니티 루틴 삭제하기
router.delete('/:id', async (req, res) => {
  try {
    await Community_Routine.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
