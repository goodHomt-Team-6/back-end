const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../middlewares/authenticateJWT');

const {
  allChallenge,
  challengeForUserBeforeJoin,
  getChallengeDetail,
  makeChallenge,
  joinChallenge,
  makeRecord,
  cancelChallenge,
} = require('../controllers/challenge');

//챌린지 가져오기
router.get('/', allChallenge);

//사용자별 참가전 챌린지 가져오기
router.get('/user', authenticateJWT, challengeForUserBeforeJoin);

//챌린지별 상세 데이터 가져오기
router.get('/:challengeId', getChallengeDetail);

//챌린지 등록하기
router.post('/', makeChallenge);

//챌린지 기록하기
router.patch('/record', authenticateJWT, makeRecord);

//챌린지 참여하기
router.patch('/:challengeId', authenticateJWT, joinChallenge);

//챌린지 참여 취소하기
router.delete('/:challengeId', authenticateJWT, cancelChallenge);

module.exports = router;
