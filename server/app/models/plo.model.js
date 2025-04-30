const mongoose = require("mongoose");

const PloCurriculumSchema = new mongoose.Schema({
    PloId: { type: String },
    ploGroupId: { type: Date },
    PloName: { type: String },
    foundPrinciplesType: { type: String },
    foundPrinciplesTypeName: { type: String },
});

const PloCurriculum = mongoose.model("Plo", PloCurriculumSchema);
module.exports = PloCurriculum;
