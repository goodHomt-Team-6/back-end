const express = require('express');
const router = express.Router();
const Routine = require('../models/routine');
const Routine_Exercise = require('../models/routine_exercise');
const Set = require('../models/set');

//Routine 등록
//authMiddleware
router.post('/', async (req, res) => {
  try {
    const { myExercise } = req.body;

    if (myExercise) {
      const routine = await Routine.create({
        userId: 1,
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

//Routine 가져오기
//authMiddleware
router.get('/', async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

module.exports = router;
