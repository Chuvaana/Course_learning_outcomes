const mongoose = require('mongoose');

const AssessmentPlanSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Lesson',
  },
  type: { type: String, required: true },
  week: { type: String, required: true },
  method: { type: String, required: true },
  methodName: { type: String, required: true },
  clo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'CLO',
  },
  cloName: { type: String, required: true },
  score: { type: Number, required: true },
});

module.exports = mongoose.model('AssessmentPlan', AssessmentPlanSchema);
