const mongoose = require('mongoose');
const commentSchema = require('./routine_comment').schema;
const likeSchema = require('./routine_like').schema;
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const CommunitySchema = new mongoose.Schema({
  routineName: {
    type: String,
  },
  myExercise: {
    type: Array,
  },
  userId: {
    type: Number,
  },
  nickname: {
    type: String,
  },
  comment: [commentSchema],
  like: [likeSchema],
  createdAt: {
    type: String,
    default: seoulTime,
  },
});

module.exports = mongoose.model('Community', CommunitySchema);
