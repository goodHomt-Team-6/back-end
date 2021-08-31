const express = require('express');
const router = express.Router();
const {
  allCommunities,
  communityDetail,
  communityEnroll,
  communityDelete,
  dupCheckNickname,
} = require('../controllers/communities');

const { authenticateJWT } = require('../middlewares/authenticateJWT');

// 커뮤니티 루틴 전부 가져오기
router.get('/', allCommunities);

// //커뮤니티 루틴 디테일 가져오기
router.get('/:routineId', communityDetail);

//커뮤니티 루틴 등록
router.post('/', authenticateJWT, communityEnroll);

//커뮤니티 루틴 삭제하기
router.delete('/:routineId', authenticateJWT, communityDelete);

//커뮤니티 닉네임 체크하기
router.post('/dupCheck', authenticateJWT, dupCheckNickname);

module.exports = router;
