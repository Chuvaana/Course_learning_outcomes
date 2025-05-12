const mongoose = require('mongoose');

const FinalExamCurriculumSchema = new mongoose.Schema({
  finalExamName: { type: String },
  lessonId: { type: String, required: true },
  examType: { type: String, required: true },
  examVersion: { type: String },
  examTakeStudentCount: { type: Number, required: true },
  finalExamQuestion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'finalExamQuestion' }],
});

const FinalExamCurriculum = mongoose.model('finalExam', FinalExamCurriculumSchema);
module.exports = FinalExamCurriculum;
