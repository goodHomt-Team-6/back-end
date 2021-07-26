const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

//운동 추가
router.post('/create', async (req, res) => {
  try {
    const { userId, categoryName, exerciseName } = req.body;

    console.log(req.body);

    const exercise = new Exercise({
      userId,
      categoryName,
      exerciseName,
    });

    await exercise.save();

    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//전체 조회
router.get('/', async (req, res) => {
  try {
    const result = await Exercise.find();

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//카테고리 별 조회
router.get('/:category', async (req, res) => {
  try {
    const category = req.params.category;

    const result = await Exercise.find({ categoryName: category });

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

module.exports = router;
