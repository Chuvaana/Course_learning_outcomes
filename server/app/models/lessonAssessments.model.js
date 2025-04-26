const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  cloId: { type: String, required: true },
  allPoint: { type: Number, required: true },
  takePoint: { type: String, required: true },
});

const LessonAssessmentsSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    studentId: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    gmail: { type: String, required: true },
    status: { type: String, required: true },
    allPoint: { type: Number, required: true },
    takePoint: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    examType: { type: String, required: true },
    examTypeName: { type: String, required: true },
    durationDate: { type: String, required: true },
    question: [QuestionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('LessonAssessments', LessonAssessmentsSchema);
