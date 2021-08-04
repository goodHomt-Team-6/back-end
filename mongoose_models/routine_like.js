const mongoose = require('mongoose');
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const Routine_LikeSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  createdAt: {
    type: String,
    default: seoulTime,
  },
});

module.exports = mongoose.model('Routine_Like', Routine_LikeSchema);
