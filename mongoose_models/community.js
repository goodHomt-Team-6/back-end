const mongoose = require('mongoose');
const commentSchema = require('./routine_comment').schema;
const likeSchema = require('./routine_like').schema;
const importSchema = require('./import').schema;
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const dates = date.getDate();
const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
const minutes =
  date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
const seconds =
  date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
const createdAt = `${year}년 ${month}월 ${dates}일 ${hours}:${minutes}:${seconds}`;

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
    isBookmarked: {
      type: Boolean,
    },
    routineTime: {
      type: Number,
    },
    isLike: {
      type: Boolean,
    },
    importCnt: {
      type: Number,
    },
    import: [importSchema],
    comment: [commentSchema],
    like: [likeSchema],
    totalLike: {
      type: Number,
    },
    createdAt: {
      type: String,
      default: createdAt,
    },
  },
  { versionKey: false }
);

CommunitySchema.index({ 'myExercise.exerciseName': 'text' });
module.exports = mongoose.model('Community', CommunitySchema);
