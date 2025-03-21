module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: { type: String, required: true },
      departments: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true }
        }
      ]
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Branch = mongoose.model("Branch", schema);
  return Branch;
};
