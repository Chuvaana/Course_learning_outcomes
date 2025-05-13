const mongoose = require('mongoose');

var schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: false },
    email: { type: String, required: true, unique: true, match: /@must\.edu\.mn$/ },
    phone: { type: Number, required: false },
    room: { type: String, required: false },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Teacher = mongoose.model('Teacher', schema);
module.exports = Teacher;
