const Category = require('../models/category');
const Default_Exercise = require('../models/default_exercise');

const { getOrSetCache } = require('../utils/cache');
//전체조회
const allExercises = async (req, res) => {
  try {
    const result = await getOrSetCache('allExercises', async () => {
      const exercises = await Default_Exercise.findAll({
        attributes: ['id', 'exerciseName'],
        order: [['createdAt', 'DESC']],
      });
      return exercises;
    });
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
};

//카데고리별 조회
const exerciseForCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await getOrSetCache(
      `exerciseForCategory-${categoryId}`,
      async () => {
        const exercisesForCateory = await Category.findAll({
          attributes: ['id', 'categoryName'],
          where: {
            id: categoryId,
          },
          include: [
            {
              model: Default_Exercise,
              as: 'exerciseList',
            },
          ],
        });
        return exercisesForCateory;
      }
    );
    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
};

module.exports = {
  allExercises,
  exerciseForCategory,
};
