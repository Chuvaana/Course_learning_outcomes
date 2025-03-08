module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      email: { type: String, required: true, unique: true, match: /@must\.edu\.mn$/ },
      branch: { type: String, required: true },
      department: { type: String, required: true },
      password: [{ type: String, required: true }]
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
