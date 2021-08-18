const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const Like_User = require('../models/like_user');
//Like등록 || 삭제
// authenticateJWT
router.put('/:routineId', authenticateJWT, async (req, res) => {
  const userId = req.userInfo.id;
  const communityId = req.params.routineId;

  try {
    const likeUser = await Like_User.findOne({
      where: {
        [Op.and]: { userId, communityId },
      },
    });
    if (likeUser) {
      await Like_User.destroy({
        where: {
          [Op.and]: { userId, communityId },
        },
      });
    } else {
      await Like_User.create({
        userId,
        communityId,
      });
    }

    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = router;
