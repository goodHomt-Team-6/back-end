const { jwtCreate } = require('../utils/jwt');
const { loginUser } = require('../utils/setLoginUser');
exports.auth = async (req, res) => {
  const profile = req.kakao;
  const [accessToken, refreshToken] = await jwtCreate(profile);

  res.json({
    ok: true,
    loginUser: loginUser(accessToken, refreshToken),
  });
};
