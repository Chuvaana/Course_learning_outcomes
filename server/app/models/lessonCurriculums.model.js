const mongoose = require("mongoose");

const LessonCurriculumSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    createdTeacherBy: { type: String },
    createdTeacherDatetime: { type: Date },
    checkManagerBy: { type: String },
    checkManagerDatetime: { type: Date }
});

const LessonCurriculum = mongoose.model("LessonCurriculums", LessonCurriculumSchema);
module.exports = LessonCurriculum;
