module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      email: { type: String, required: true, unique: true, match: /@must\.edu\.mn$/ },
      branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
      department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }
      // courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Teacher = mongoose.model("Teacher", schema);
  return Teacher;
};
