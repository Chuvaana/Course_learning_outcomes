const mongoose = require('mongoose');

const ScheduleSemSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  week: { type: String, required: true },
  title: { type: String },
  time: { type: Number, required: true },
  cloRelevance: { type: mongoose.Schema.Types.ObjectId, ref: 'Clo', default: null },
  point: [
    {
      id: { type: String },
      point: { type: Number },
    },
  ],
});

module.exports = mongoose.model('ScheduleSem', ScheduleSemSchema);
