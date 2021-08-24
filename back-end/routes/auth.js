const express = require('express');
const router = express.Router();

const { getKakaoUser } = require('../middlewares/getKakaoUser');
const { auth } = require('../controllers/auth');

router.post('/kakaoLogin', getKakaoUser, auth);

module.exports = router;
