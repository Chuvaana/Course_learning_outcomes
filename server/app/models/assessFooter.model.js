// models/AssessFooter.js
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
