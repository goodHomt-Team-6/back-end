const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

//로그아웃
router.get('/logout', async (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/auth/kakao',
  }),
  (req, res) => {
    res.json({
      ok: true,
      message: 'kakao 로그인 성공!',
      token: createJwt(req.user),
    });
  }
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google',
  }),
  (req, res) => {
    createJwt(req.user);
    res.json({
      ok: true,
      message: 'google 로그인 성공!',
      token: createJwt(req.user),
    });
  }
);

function createJwt(user) {
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
  return token;
}

module.exports = router;
