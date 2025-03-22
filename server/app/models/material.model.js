const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    lessonId: { type: String, required: true },
    mainBooks: [{ type: String }],
    extraMaterials: [{ type: String }],
    webLinks: { type: String },
    libraryLink: { type: String },
    softwareTools: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
