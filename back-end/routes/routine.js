const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Routine = require('../models/routine');
const Routine_Exercise = require('../models/routine_exercise');
const Set = require('../models/set');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

/**
 *  @swagger
 *    $ref: 'swagger/routineAPI.yml'
 */

//Routine 가져오기
router.get('/', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const params = req.query;
  let where;
  if (params.sorting) {
    if (params.sorting === 'bookmark') {
      where = { isBookmarked: true };
    } else {
      where = Sequelize.literal(
        `Routine.createdAt > DATE_FORMAT(date_add(NOW(), INTERVAL - 1 ${params.sorting}), '%Y%m%d')`
      );
    }
  } else if (params.date) {
    where = Sequelize.literal(
      `DATE_FORMAT(Routine.createdAt, '%Y%m%d') = ${params.date}`
    );
  } else {
    where = {};
  }
  try {
    const result = await Routine.findAll({
      where: {
        [Op.and]: [{ userId }, where],
      },
      attributes: [
        'id',
        'routineName',
        'isBookmarked',
        'isCompleted',
        'routineTime',
        'rating',
        'createdAt',
      ],
      include: [
        {
          model: Routine_Exercise,
          attributes: ['id', 'exerciseName'],
          as: 'myExercise',
          include: [
            {
              model: Set,
              as: 'set',
            },
          ],
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

//Routine 상세 가져오기
router.get('/:id', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const id = req.params;
  try {
    const result = await Routine.findAll({
      attributes: [
        'id',
        'routineName',
        'routineTime',
        'rating',
        'isBookmarked',
        'isCompleted',
        'createdAt',
      ],
      where: {
        [Op.and]: [{ userId }, id],
      },
      include: [
        {
          model: Routine_Exercise,
          attributes: ['id', 'exerciseName'],
          as: 'myExercise',
          include: [
            {
              model: Set,
              as: 'set',
              attributes: [
                'id',
                'setCount',
                'weight',
                'count',
                'minutes',
                'seconds',
                'type',
                'order',
              ],
            },
          ],
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
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { myExercise } = req.body;
    const userId = req.userId;
    const routineName = `${myExercise[0]['exerciseName']} ${
      myExercise.length > 1 ? '외 ' + (myExercise.length - 1) + '개' : ''
    }`;

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
    }
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//Routine 북마크 수정
router.patch('/bookmark', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const { id, isBookmarked, routineName } = req.body;
  try {
    const routine = await Routine.findByPk(id);
    if (userId !== routine.userId) {
      return res.json({ ok: false, message: '수정할 권한이 없습니다' });
    }

    const result = await Routine.update(
      {
        isBookmarked,
        routineName,
      },
      {
        where: { id },
      }
    );
    console.log(result);
    res.json({ ok: true, routineId: id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//운동기록 저장
router.patch('/result', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const { id, routineTime, rating, isCompleted } = req.body;
  try {
    const routine = await Routine.findByPk(id);
    if (userId !== routine.userId) {
      return res.json({ ok: false, message: '권한이 없습니다' });
    }

    await Routine.update(
      {
        routineTime,
        rating,
        isCompleted,
      },
      {
        where: { id },
      }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

router.put('/:routineId', async (req, res) => {
  const userId = req.userId;
  const routineId = req.params.routineId;
  const { myExercise } = req.body;

  if (myExercise) {
    for (let i = 0; i < myExercise.length; i++) {
      const { set } = myExercise[i];

      for (let i = 0; i < set.length; i++) {
        const inputSet = set[i];
        console.log(inputSet);
        await Set.update(inputSet, {
          where: { id: inputSet.id },
        });
      }
    }
  }
  res.status(200).send({ ok: true });
});

router.delete('/:routineId', authenticateJWT, async (req, res) => {
  const userId = req.userId;
  const { routineId } = req.params;

  try {
    const routine = await Routine.findOne({
      where: { id: routineId },
    });

    if (userId !== routine.userId) {
      return res.json({ ok: false, message: '권한이 없습니다' });
    }

    await Routine.destroy({
      where: { id: routineId },
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});
module.exports = router;
