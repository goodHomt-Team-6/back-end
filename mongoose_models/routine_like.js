const mongoose = require('mongoose');
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const Routine_LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: seoulTime,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Routine_Like', Routine_LikeSchema);
