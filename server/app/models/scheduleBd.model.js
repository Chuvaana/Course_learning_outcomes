const mongoose = require('mongoose');

const ScheduleBdSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    week: { type: String, required: true },
    title: { type: String, required: true },
    adviceTime: { type: Number, required: true },
    time: { type: Number, required: true },
    cloRelevance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clo' }]
});

module.exports = mongoose.model('ScheduleBd', ScheduleBdSchema);
