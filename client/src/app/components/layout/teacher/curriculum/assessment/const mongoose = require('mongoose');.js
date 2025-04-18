const mongoose = require('mongoose');

const AssessFooterSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  name: { type: String, required: true },
  attendanceValue: { type: Number, required: true },
  assignmentValue: { type: Number, required: true },
  quizValue: { type: Number, required: true },
  projectValue: { type: Number, required: true },
  labValue: { type: Number, required: true },
  examValue: { type: Number, required: true },
});

const AssessFooter = mongoose.model('AssessFooter', AssessFooterSchema);

module.exports = AssessFooter;

const AssessFooterSchema1 = new mongoose.Schema({
  lessonId: { type: String, required: true },
  name: { type: String, required: true },
  attendanceValue: [{ type: String, required: true }],
  assignmentValue: [{ type: String, required: true }],
  quizValue: [{ type: String, required: true }],
  projectValue: [{ type: String, required: true }],
  labValue: [{ type: String, required: true }],
  examValue: [{ type: String, required: true }],
});

const AssessFooter1 = mongoose.model('AssessFooter1', AssessFooterSchema1);

module.exports = AssessFooter1;
