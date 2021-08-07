const express = require('express');
const router = express.Router();
const Challenge = require('../mongoose_models/challenge');

router.post('/challenge', async (req, res) => {
    const { adminId, adminPW } = req.body;
});

module.exports = router;
