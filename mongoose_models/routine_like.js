const mongoose = require('mongoose');

const Routine_LikeSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
});

module.exports = mongoose.model('Routine_Like', Routine_LikeSchema);
