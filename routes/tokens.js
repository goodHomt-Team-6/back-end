const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const { getNewAuth } = require('../utils/renewAuth');

router.get('/', authenticateJWT, async (req, res) => {
  const { token } = req.loginUser;
  const [accessToken] = await getNewAuth(token.refreshToken);
  res.json({
    ok: true,
    loginUser: { token: { accessToken, refreshToken: token.refreshToken } },
  });
});

module.exports = router;
