const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
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
    attendance: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LesStudent',
          required: true,
        },
        status: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', AttendanceSchema);
