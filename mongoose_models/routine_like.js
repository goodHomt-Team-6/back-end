const mongoose = require('mongoose');
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

const Routine_LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      default: createdAt,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Routine_Like', Routine_LikeSchema);
