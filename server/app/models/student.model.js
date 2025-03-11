const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /@must\.edu\.mn$/ },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Ensure you export it as a model
const Student = mongoose.model("Student", schema);
module.exports = Student;
