const mongoose = require('mongoose');

const Routine_CommentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model('Routine_Comment', Routine_CommentSchema);
