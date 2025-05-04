const mongoose = require("mongoose");

const FinalExamQuestionCurriculumSchema = new mongoose.Schema({
    orderId: { type: Number , required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    verb: { type: mongoose.Schema.Types.ObjectId, ref: 'Verb' },
    verbName: { type : String , required: true },
    version: { type : String },
    examType: { type : String , required: true },
    blmLvl: { type: Number },
    cloCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Clo' },
    cloName: { type : String , required: true },
});

const FinalExamQuestionCurriculum = mongoose.model("finalExamQuestion", FinalExamQuestionCurriculumSchema);
module.exports = FinalExamQuestionCurriculum;
