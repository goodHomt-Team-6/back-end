const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Default_Exercise = require('../models/default_exercise');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
/**
 *  @swagger
 *    $ref: 'swagger/exerciseAPI.yml'
 */

//전체 조회
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const result = await Default_Exercise.findAll({
      attributes: ['id', 'exerciseName'],
      order: [['createdAt', 'DESC']],
    });

    res.json({ ok: true, result, loginUser: req.loginUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

//카테고리 별 조회
router.get('/:categoryId', authenticateJWT, async (req, res) => {
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

    res.json({ ok: true, result, loginUser: req.loginUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: error });
  }
});

module.exports = router;
