const mongoose = require('mongoose');

const LessonFeedbackSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    strengths: { type: String, required: true },
    weaknesses: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LessonFeedback', LessonFeedbackSchema);
