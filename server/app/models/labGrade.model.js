const mongoose = require('mongoose');

const LabGradeSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson', // Reference to Lesson model
      required: true,
    },
    weekDay: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    type: {
      type: String,
      enum: ['lec', 'sem', 'lab'], // Lecture, Seminar, Laboratory
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
    labGrade: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LesStudent',
          required: true,
        },
        grade1: {
          type: Number,
          required: true,
        },
        grade2: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('LabGrade', LabGradeSchema);
