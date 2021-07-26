const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');

//Routine 등록
//authMiddleware
router.post('/', async (req, res) => {
  try {
    const { userId, routineName, routine } = req.body;

    // const { routineName, routine } = req.body;

    // const { userId } = res.locals.user;

    console.log(routine);

    const myRoutine = new Routine({
      userId,
      routineName,
      routine,
    });

    await myRoutine.save();

    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//Routine 가져오기
//authMiddleware
router.get('/', async (req, res) => {
  try {
    // const { userId } = res.locals.user;

    // const result = await Routine.find({ userId: userId });

    const result = await Routine.find();

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

module.exports = router;
