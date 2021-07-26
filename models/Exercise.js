const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  categoryName: {
    type: String,
  },
  exerciseName: {
    type: String,
  },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
