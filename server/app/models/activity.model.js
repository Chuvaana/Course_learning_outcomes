const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    weekDay: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    type: {
      type: String,
      enum: ['alec', 'bsem', 'clab'],
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    weekNumber: {
      type: String,
      required: true,
    },
    activity: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LesStudent',
          required: true,
        },
        point: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);
