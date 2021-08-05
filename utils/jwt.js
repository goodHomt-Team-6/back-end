const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.jwtCreate = async (profile) => {
  const basicInfo = {
    email: profile.data?.kakao_account?.email || null,
    nickname: profile.data?.kakao_account?.profile.nickname || null,
    img: profile.data?.kakao_account?.profile.profile_image_url || null,
  };

  const snsId = profile.data?.id || profile.id;
  console.log('snsId!!!!!!!', snsId);
  console.log(profile.data?.kakao_account?.profile);
  const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESHTOKEN_EXPIRE,
  });

  try {
    const exUser = await User.findOne({
      where: { [Op.and]: [{ snsId }, { provider: 'kakao' }] },
    });
    console.log('exUser!!!', exUser.id);

    if (exUser) {
      await User.update(
        {
          ...basicInfo,
          refreshToken,
        },
        {
          where: { snsId },
        }
      );
      basicInfo.id = exUser.id;
    } else {
      const user = await User.create({
        ...basicInfo,
        snsId,
        provider: 'kakao',
        refreshToken,
      });
      basicInfo.id = user.id;
    }
    console.log('basicInfo!!!', basicInfo);
    const accessToken = jwt.sign(basicInfo, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE,
    });
    return [accessToken, refreshToken];
  } catch (error) {
    console.error(error);
  }
};
