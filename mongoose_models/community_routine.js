const mongoose = require('mongoose');
const commentSchema = require('./routine_comment').schema;
const likeSchema = require('./routine_like').schema;
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const Community_RoutineSchema = new mongoose.Schema({
  routineName: {
    type: String,
  },
  routine_id: {
    type: String,
  },
  exerciseName: {
    type: Array,
  },
  set: {
    type: Array,
  },
  userEmail: {
    type: String,
  },
  createdAt: {
    type: String,
    default: seoulTime,
  },
  comment: [commentSchema],
  like: [likeSchema],
});

module.exports = mongoose.model('Community_Routine', Community_RoutineSchema);
