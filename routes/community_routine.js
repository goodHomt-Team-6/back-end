const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const User = require('../models/user');

//커뮤니티에 루틴등록
router.post('/', async (req, res) => {
  const {
    routine: {
      routineName,
      routine_id,
      myExercise: { exerciseName, set },
      user_id,
    },
  } = req.body;

  try {
    const user = await User.findOne({
      where: { id: user_id },
    });

    const cr = new Community_Routine({
      routineName,
      routine_id,
      exerciseName,
      set,
      user,
    });
    await cr.save();
    res.status(200).send({});
  } catch (error) {}
});

//커뮤니티 전체루틴 가져오기
router.get('/', async (req, res) => {
  try {
    const result = await Community_Routine.find();
    res.send({ result });
  } catch (error) {}
});

//커뮤니티 루틴 디테일 가져오기

module.exports = router;
