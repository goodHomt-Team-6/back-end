const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.getNewAuth = async function (refreshToken) {
  console.log('refreshToken!!!', refreshToken);
  try {
    const info = await User.findOne({
      attributes: ['id', 'email', 'nickname', 'img', 'communityNickname'],
      where: { refreshToken },
    });

    console.log(info);
    const basicInfo = {
      id: info.id,
      email: info.email,
      nickname: info.nickname,
      img: info.img,
      communityNickname: info.communityNickname,
    };
    const accessToken = jwt.sign(basicInfo, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE,
    });
    console.log('되나');
    return [accessToken, info.id, info.nickname];
  } catch (error) {
    console.error(error);
  }
};
