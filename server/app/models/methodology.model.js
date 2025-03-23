const mongoose = require('mongoose');

const MethodologySchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    pedagogy: { type: String, required: true },
    deliveryMode: { type: String, required: true },
    cloRelevance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clo' }],
    classroom: { type: Boolean, required: true },
    electronic: { type: Boolean, required: true },
    combined: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Methodology', MethodologySchema);
