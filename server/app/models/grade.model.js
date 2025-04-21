const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema(
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
      enum: ['lec', 'sem', 'lab', 'bd'],
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
    studentGrades: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LesStudent',
          required: true,
        },
        grades: [
          {
            id: String,
            point: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grade', GradeSchema);
