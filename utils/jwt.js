const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.jwtCreate = async (profile) => {
  const basicInfo = {
    email: profile.kakao_account.email,
    nickname: profile.kakao_account.profile.nickname,
    img: profile.kakao_account.profile.profile_image_url,
  };

  const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESHTOKEN_EXPIRE,
  });

  try {
    const exUser = await User.findOne({
      where: { [Op.and]: [{ snsId: profile.id }, { provider: 'kakao' }] },
    });
    console.log('exUser!!@#', exUser);
    if (exUser) {
      await User.update(
        {
          ...basicInfo,
          refreshToken,
        },
        {
          where: { snsId: profile.id },
        }
      );
    } else {
      await User.create({
        ...basicInfo,
        snsId: profile.id,
        provider: 'kakao',
        refreshToken,
      });
    }
    const accessToken = jwt.sign(basicInfo, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE,
    });
    return [accessToken, refreshToken];
  } catch (error) {
    console.error(error);
  }
};
