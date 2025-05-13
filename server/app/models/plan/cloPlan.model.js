// models/CloPlan.js
const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema(
  {
    subMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'SubMethod', // or whatever your sub method collection is
    },
    point: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const CloPlanPointSchema = new mongoose.Schema({
  cloId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'CLO',
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Lesson',
  },
  cloType: {
    type: String,
    enum: ['ALEC', 'BSEM', 'CLAB'],
    required: true,
  },
  procPoints: [PointSchema],
  examPoints: [PointSchema],
});

module.exports = mongoose.model('CloPlanPoint', CloPlanPointSchema);
