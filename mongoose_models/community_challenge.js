const mongoose = require('mongoose');

const Community_ChallengeSchema = new mongoose.Schema({});

module.exports = mongoose.model(
  'Community_Challenge',
  Community_ChallengeSchema
);
