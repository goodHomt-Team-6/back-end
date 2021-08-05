const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authenticateJWT');

router.get('/', authenticateJWT, async (req, res) => {
  res.json({
    ok: true,
    loginUser: req.loginUser,
  });
});

module.exports = router;
