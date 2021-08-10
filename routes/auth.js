const express = require('express');
const router = express.Router();

const { getKakaoUser } = require('../middlewares/getKakaoUser');
const { jwtCreate } = require('../utils/jwt');
const { loginUser } = require('../utils/setLoginUser');

//로그아웃
router.get('/logout', async (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({ ok: true });
});

router.post('/kakaoLogin', getKakaoUser, async (req, res) => {
  const profile = req.kakao;
  const [accessToken, refreshToken] = await jwtCreate(profile);

  res.json({
    ok: true,
    loginUser: loginUser(accessToken, refreshToken),
  });
});

module.exports = router;
