const mongoose = require("mongoose");

const LessonCurriculumSchema = new mongoose.Schema({
    lessonId: { type: String },
    createdTeacherBy: { type: String },
    createdTeacherDatetime: { type: Date },
    checkManagerBy: { type: String },
    checkManagerDatetime: { type: Date }
});

const LessonCurriculum = mongoose.model("LessonCurriculums", LessonCurriculumSchema);
module.exports = LessonCurriculum;
