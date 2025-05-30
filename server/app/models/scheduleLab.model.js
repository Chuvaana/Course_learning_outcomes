const mongoose = require('mongoose');

const ScheduleLabSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  week: { type: String, required: true },
  title: { type: String },
  time: { type: Number, required: true },
  cloRelevance: { type: mongoose.Schema.Types.ObjectId, ref: 'Clo' },
  point: [
    {
      id: { type: String },
      point: { type: Number },
    },
  ],
});

module.exports = mongoose.model('ScheduleLab', ScheduleLabSchema);
