const mongoose = require('mongoose');

const ScheduleBdSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  week: { type: String, required: true },
  title: { type: String },
  adviceTime: { type: Number, required: true },
  time: { type: Number, required: true },
  cloRelevance: { type: mongoose.Schema.Types.ObjectId, ref: 'Clo' },
  point: [
    {
      id: { type: String },
      point: { type: Number },
    },
  ],
});

module.exports = mongoose.model('ScheduleBd', ScheduleBdSchema);
