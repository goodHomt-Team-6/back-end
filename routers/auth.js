const express = require('express');
const router = express.Router();
const passport = require('passport');

//로그아웃
router.get('/logout', async (req, res) => {
  console.log('session!!', req.session);
  req.logout();
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureMessage: 'kakao 로그인에 실패하였습니다',
  }),
  (req, res) => {
    console.log('req.User!!!', req.user);
    res.json({ ok: true, message: '로그인 성공!' });
  }
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureMessage: '구글 로그인에 실패하였습니다',
  }),
  (req, res) => {
    console.log('req.User!!!', req.user);
    res.json({ ok: true, message: '로그인 성공!' });
  }
);

module.exports = router;
