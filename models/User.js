const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  nick: {
    type: String,
  },
  provider: {
    type: String,
  },
  snsId: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
