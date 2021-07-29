const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Default_Exercise = require('../models/default_exercise');

/**
 *  @swagger
 *    $ref: 'swagger/exerciseAPI.yml'
 */

//전체 조회
router.get('/', async (req, res) => {
  try {
    const result = await Category.findAll({
      attributes: ['id', 'categoryName'],
      include: [
        {
          model: Default_Exercise,
          as: 'exerciseList',
        },
      ],
    });

    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//카테고리 별 조회
router.get('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const result = await Category.findAll({
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

    res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

module.exports = router;
