const jwt = require('jsonwebtoken');
const User = require('../models/user');
const controller = {
  async login(req, res, next) {
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: '14d',
    });
    let email, nickname, snsId, provider, img;
    try {
      const exUser = await User.findeOne({
        where: { email },
      });
      if (exUser) {
      } else {
        await User.create({
          email,
          nickname,
          img,
          snsId,
          provider,
          refreshToken,
        });
      }
      const accssToken = jwt.sign(
        {
          email,
          nickname,
          img,
        },
        process.env.JWT_SECRET,
        { expiresIn: '60' }
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = controller;
