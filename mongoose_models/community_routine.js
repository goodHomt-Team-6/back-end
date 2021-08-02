const mongoose = require('mongoose');
const commentSchema = require('./routine_comment').schema;
const likeSchema = require('./routine_like').schema;

const Community_RoutineSchema = new mongoose.Schema({
  routineName: {},
  routine_id: {},
  exerciseName: {},
  set: {},
  user: {},
  comment: [commentSchema],
  like: [likeSchema],
});

module.exports = mongoose.model('Community_Routine', Community_RoutineSchema);
