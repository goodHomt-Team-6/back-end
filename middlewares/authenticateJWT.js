const jwt = require('jsonwebtoken');
const { getNewAuth } = require('../utils/renewAuth');
const { loginUser } = require('../utils/setLoginUser');

exports.authenticateJWT = async (req, res, next) => {
  try {
    const [accessToken, refreshToken] = req.headers['authorization'].split(',');

    console.log('accessToken!!!', accessToken);
    console.log('refreshToken!!!', refreshToken);

    const iAccessToken = verifyToken(accessToken);
    const irefreshToken = verifyToken(refreshToken);

    console.log('message1', iAccessToken);
    console.log('message2', irefreshToken);

    if (iAccessToken === 'jwt malformed' || irefreshToken === 'jwt malformed') {
      res.status(403).json({ ok: false, message: 'invalid token' });
    }

    if (iAccessToken === 'jwt expired') {
      console.log('accessToken Expired!!!');
      if (irefreshToken) {
        const [accessToken, id, nickname] = await getNewAuth(refreshToken);
        req.loginUser = loginUser(accessToken, refreshToken);
        req.userId = id;
        req.userInfo = { id, nickname };
        next();/
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
  } catch (error) {
    console.error(error);
    next(error);
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
