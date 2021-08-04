const express = require('express');
const router = express.Router();
const Routine = require('../models/routine');
const Routine_Exercise = require('../models/routine_exercise');
const Set = require('../models/set');

/**
 *  @swagger
 *    $ref: 'swagger/routineAPI.yml'
 */

//Routine 가져오기
//authMiddleware
router.get('/', async (req, res) => {
  const userId = 3;
  try {
    const result = await Routine.findAll({
      where: { userId },
      attributes: ['id', 'routineName'],
      include: [
        {
          model: Routine_Exercise,
          attributes: ['id', 'exerciseName'],
          as: 'myExercise',
          include: [{ model: Set }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//Routine 등록
//authMiddleware
router.post('/', async (req, res) => {
  try {
    const { routineName, myExercise } = req.body;
    console.log(myExercise);
    if (myExercise) {
      const routine = await Routine.create({
        userId: 3,
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
