const mongoose = require('mongoose');
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const Challenge_UserSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
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

module.exports = mongoose.model('Challenge_User', Challenge_UserSchema);
