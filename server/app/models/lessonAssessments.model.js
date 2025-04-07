const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  cloId: { type: String, required: true },
  allPoint: { type: Number, required: true },
  takePoint: { type: String, required: true },
});

const LessonAssessmentsSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  studentId: { type: String, required: true },
  allPoint: { type: Number, required: true },
  takePoint: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  durationDate: { type: String, required: true },
  question: [QuestionSchema],
}, { timestamps: true });

module.exports = mongoose.model('LessonAssessments', LessonAssessmentsSchema);
