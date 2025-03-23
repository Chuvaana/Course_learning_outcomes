const mongoose = require('mongoose');

const CloSchema = new mongoose.Schema(
    {
        lessonId: { type: String, required: true },
        type: { type: String, required: true },
        cloName: { type: String, required: true },
        knowledge: { type: Boolean },
        skill: { type: Boolean },
        attitude: { type: Boolean },
    },
    { timestamps: true }
);

// Convert _id to id in JSON responses
CloSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id.toString(); // Convert _id to string
    return object;
});

module.exports = mongoose.model('Clo', CloSchema);
