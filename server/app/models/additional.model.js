const mongoose = require("mongoose");

const AdditionalSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    additional: [{ type: String, required: true }]
});

const Additional = mongoose.model("Additional", AdditionalSchema);
module.exports = Additional;
