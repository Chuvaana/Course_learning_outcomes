const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    mainBooks: [{ type: String }],
    extraMaterials: [{ type: String }],
    webLinks: [{ type: String }],
    libraryLinks: [{ type: String }],
    softwareTools: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', MaterialSchema);
