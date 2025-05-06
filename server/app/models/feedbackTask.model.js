// models/FeedbackTask.js
const mongoose = require('mongoose');

const feedbackTaskSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    category: { type: String, required: true },
    categoryChanged: { type: Boolean, default: false },
    description: { type: String, required: true },
    index: { type: Number, required: true },
    selected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedbackTask', feedbackTaskSchema);
