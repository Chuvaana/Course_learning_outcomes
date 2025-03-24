const mongoose = require("mongoose");
var studentSchema = mongoose.Schema(
    {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        lec: {
            day: { type: String },
            time: { type: String },
        },
        sem: {
            day: { type: String },
            time: { type: String },
        },
        lab: {
            day: { type: String },
            time: { type: String },
        },
    },
    { timestamps: true }
);

studentSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

// Ensure you export it as a model
const Student = mongoose.model("LesStudent", studentSchema);
module.exports = Student;
