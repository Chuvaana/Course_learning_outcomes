const mongoose = require('mongoose');

const MethodologySchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    pedagogy: { type: String, required: true },
    deliveryMode: { type: String, required: true },
    cloRelevance: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Methodology', MethodologySchema);
