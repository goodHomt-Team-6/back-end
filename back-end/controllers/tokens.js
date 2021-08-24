const { getNewAuth } = require('../utils/renewAuth');
exports.tokens = async (req, res) => {
  const { token } = req.loginUser;
  const [accessToken] = await getNewAuth(token.refreshToken);
  res.json({
    ok: true,
    loginUser: { token: { accessToken, refreshToken: token.refreshToken } },
  });
};
