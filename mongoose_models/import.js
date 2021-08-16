const mongoose = require('mongoose');
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(Date.now(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const ImportSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  createdAt: {
    type: String,
    default: seoulTime,
  },
});

module.exports = mongoose.model('Import', ImportSchema);
