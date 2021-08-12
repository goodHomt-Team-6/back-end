const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { loginUser } = require('../utils/setLoginUser');

exports.authenticateJWT = async (req, res, next) => {
  const [accessToken, refreshToken] = req.headers['authorization'].split(',');
  console.log('accessToken!!!', accessToken);
  console.log('refreshToken!!!', refreshToken);
  const iAccessToken = verifyToken(accessToken);
  const irefreshToken = verifyToken(refreshToken);

  if (
    (typeof iAccessToken === 'string' && iAccessToken.includes('invalid')) ||
    (typeof irefreshToken === 'string' && irefreshToken.includes('invalid'))
  ) {
    res.status(403).json({ ok: false, message: 'wrong token' });
  }
  if (iAccessToken === 'jwt expired') {
    console.log('accessToken Expired!!!');
    if (irefreshToken) {
      const info = await User.findOne({
        attributes: ['id', 'email', 'nickname', 'img', 'communityNickname'],
        where: { refreshToken },
      });
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
      req.loginUser = loginUser(accessToken, refreshToken);
      req.userId = info.id;
      req.userInfo = { id: info.id, nickname: info.nickname };
      next();
    } else {
      res.json({
        ok: false,
        needsLogin: true,
        message: '로그인이 필요합니다.',
      });
    }
  } else {
    req.loginUser = loginUser(accessToken, refreshToken);
    req.userId = iAccessToken.id;
    req.userInfo = { id: iAccessToken.id, nickname: iAccessToken.nickname };
    next();
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error(error);
    return error.message;
  }
}
