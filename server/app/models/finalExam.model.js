const mongoose = require("mongoose");

const FinalExamCurriculumSchema = new mongoose.Schema({
    finalExamName: { type: String },
    examType: { type: String },
    examVersion: { type: String },
    examTakeStudentCount: { type: Date },
    cloRelevance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clo' }],
});

const FinalExamCurriculum = mongoose.model("finalExam", FinalExamCurriculumSchema);
module.exports = FinalExamCurriculum;
