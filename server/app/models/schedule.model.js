const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    week: { type: String, required: true },
    title: { type: String },
    time: { type: Number, required: true },
    cloRelevance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clo' }]
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
