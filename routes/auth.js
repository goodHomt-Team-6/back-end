const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

  const basicInfo = {
    email: profile.kakao_account.email,
    nickname: profile.kakao_account.profile.nickname,
    img: profile.kakao_account.profile.profile_image_url,
  };
  res.json({
    ok: true,
    loginUser: loginUser(basicInfo, accessToken, refreshToken),
  });
});

// router.get('/kakao', passport.authenticate('kakao'));

// router.get(
//   '/kakao/callback',
//   passport.authenticate('kakao', {
//     failureRedirect: '/auth/kakao',
//   }),
//   (req, res) => {
//     res.redirect(`http://localhost:3000/token=${createJwt(req.user)}`);
//     // res.json({
//     //   ok: true,
//     //   message: 'kakao 로그인 성공!',
//     //   token: ,
//     // });
//   }
// );

// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/auth/google',
//   }),
//   (req, res) => {
//     res.redirect(`http://localhost:3000/token=${createJwt(req.user)}`);
//     // createJwt(req.user);
//     // res.json({
//     //   ok: true,
//     //   message: 'google 로그인 성공!',
//     //   token: createJwt(req.user),
//     // });
//   }
// );

module.exports = router;
