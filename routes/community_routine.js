const express = require('express');
const router = express.Router();
const Community_Routine = require('../mongoose_models/community_routine');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

//커뮤니티 루틴 등록
//authenticateJWT
router.post('/', async (req, res) => {
  const {
    routine: {
      routineName,
      routine_id,
      myExercise: { exerciseName, set },
    },
  } = req.body;

  // const { routineName, routine_id, exerciseName, set, userEmail } = req.body;
  const userEmail = req.loginUser.user.email;

  try {
    if (!req.loginUser.user) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (req.loginUser.user) {
      const cr = new Community_Routine({
        routineName,
        routine_id,
        exerciseName,
        set,
        userEmail,
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
  try {
    const result = await Community_Routine.find();
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//커뮤니티 루틴 디테일 가져오기
router.get('/:id', async (req, res) => {
  try {
    const result = await Community_Routine.findById(req.params.id);
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//커뮤니티 루틴 삭제하기
router.delete('/:id', authenticateJWT, async (req, res) => {
  const userEmail = req.loginUser.user.email;
  const routine = await Community_Routine.findById(req.params.id);
  try {
    if (!req.loginUser.user) {
      res.status(500).json({ errorMessage: '사용자가 아닙니다.' });
      return;
    }
    if (userEmail !== routine.userEmai) {
      res.status(500).json({ errorMessage: '사용자가 일치하지 않습니다.' });
      return;
    }
    if (userEmail === routine.userEmail) {
      await Community_Routine.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: 'success' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
