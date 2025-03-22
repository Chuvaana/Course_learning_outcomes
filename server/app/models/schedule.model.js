const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    lessonId: { type: String, required: true},
    week: { type: Number, required: true },
    title: { type: String, required: true },
    time: { type: Number, required: true },
    type: { type: String, required: true }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
