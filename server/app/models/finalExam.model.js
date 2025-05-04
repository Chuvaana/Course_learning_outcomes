const mongoose = require('mongoose');

const FinalExamCurriculumSchema = new mongoose.Schema({
  finalExamName: { type: String },
  examType: { type: String },
  examVersion: { type: String },
  examTakeStudentCount: { type: Date },
  cloRelevance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clo' }],
});

module.exports = mongoose.model('finalExam', FinalExamCurriculumSchema);
