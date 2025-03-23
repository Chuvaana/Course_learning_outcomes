const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    clo: { type: mongoose.Schema.Types.ObjectId, ref: "Clo", required: true },
    attendance: { type: Boolean, required: false },
    assignment: { type: Boolean, default: false },
    quiz: { type: Boolean, default: false },
    project: { type: Boolean, default: false },
    lab: { type: Boolean, default: false },
    exam: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Assessment", AssessmentSchema);
