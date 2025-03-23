const mongoose = require('mongoose');

const definitionSchema = new mongoose.Schema({
  lessonId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Definition', definitionSchema);
