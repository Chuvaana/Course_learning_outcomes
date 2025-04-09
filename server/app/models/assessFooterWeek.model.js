const mongoose = require('mongoose');

const AssessFooterWeekSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  name: { type: String, required: true },
  attendanceValue: [{ type: String, required: true }],
  assignmentValue: [{ type: String, required: true }],
  quizValue: [{ type: String, required: true }],
  projectValue: [{ type: String, required: true }],
  labValue: [{ type: String, required: true }],
  examValue: [{ type: String, required: true }],
});

const AssessFooterWeek = mongoose.model('AssessFooterWeek', AssessFooterWeekSchema);

module.exports = AssessFooterWeek;
