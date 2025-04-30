const mongoose = require('mongoose');

var schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /@must\.edu\.mn$/ },
    password: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    department: { type: String, required: true },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Ensure you export it as a model
const Student = mongoose.model('Student', schema);
module.exports = Student;
