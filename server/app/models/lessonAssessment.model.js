const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  cloId: { type: String, required: true },
  allPoint: { type: Number, required: true },
  takePoint: { type: Number, required: true },
});

const LessonAssessmentSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  studentId: { type: String, required: true },
  allPoint: { type: Number, required: true },
  takePoint: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationDate: { type: Date, required: true },
  question: [QuestionSchema],
}, { timestamps: true });

module.exports = mongoose.model('LessonAssessment', LessonAssessmentSchema);
