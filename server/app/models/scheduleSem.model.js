const mongoose = require('mongoose');

const ScheduleSemSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    week: { type: String, required: true },
    title: { type: String, required: true },
    time: { type: Number, required: true },
    cloRelevance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clo' }]
});

module.exports = mongoose.model('ScheduleSem', ScheduleSemSchema);
