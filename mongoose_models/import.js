const mongoose = require('mongoose');

const ImportSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
});

module.exports = mongoose.model('Import', ImportSchema);
