const express = require('express');
const router = express.Router();
const Routine_Like = require('../mongoose_models/routine_like');
const User = require('../models/user');


router.post('', async (req, res) => {
   
    const { user_id } = req.body

    try {
        const user = await User.findOne({
            where: { id: user_id },
    } catch (error) {
        
    }

});


module.exports = router;
