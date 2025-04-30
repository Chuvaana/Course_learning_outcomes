const mongoose = require("mongoose");

const VerbCurriculumSchema = new mongoose.Schema({
    verbCode: { type: String },
    verbName: { type: String },
});

const VerbCurriculum = mongoose.model("Verb", VerbCurriculumSchema);
module.exports = VerbCurriculum;
