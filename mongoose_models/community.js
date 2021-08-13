const mongoose = require('mongoose');
const commentSchema = require('./routine_comment').schema;
const likeSchema = require('./routine_like').schema;
const moment = require('moment-timezone');
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const CommunitySchema = new mongoose.Schema(
  {
    routineName: {
      type: String,
    },
    description: {
      type: String,
    },
    myExercise: {
      type: Array,
    },
    userId: {
      type: Number,
    },
    communityNickname: {
      type: String,
    },
    img: {
      type: String,
    },
    importCnt: {
      type: Number,
    },
    isBookmarked: {
      type: Boolean,
    },
    routineTime: {
      type: Number,
    },
    comment: [commentSchema],
    like: [likeSchema],
    totalLike: {
      type: Number,
    },
    isLike: {
      type: Boolean,
    },
    createdAt: {
      type: String,
      default: seoulTime,
    },
  },
  { versionKey: false }
);

CommunitySchema.index({ 'myExercise.exerciseName': 'text' });
module.exports = mongoose.model('Community', CommunitySchema);
