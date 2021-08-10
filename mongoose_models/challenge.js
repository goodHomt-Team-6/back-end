const mongoose = require('mongoose');
const moment = require('moment-timezone');
const ChallengeUserSchema = require('./challenge_user').schema;
const seoulTime = moment
  .tz(new Date(), 'Asia/Seoul')
  .format('YYYY-MM-DD HH:mm:ss');

const ChallengeSchema = new mongoose.Schema(
  {
    challengeName: {
      type: String,
    },
    routine: {
      type: Array,
    },
    Description: {
      type: String,
    },
    challengeUser: [ChallengeUserSchema],
    createdAt: {
      type: String,
      default: seoulTime,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Challenge', ChallengeSchema);
