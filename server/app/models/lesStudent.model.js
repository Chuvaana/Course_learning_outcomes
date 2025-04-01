const mongoose = require("mongoose");
var studentSchema = mongoose.Schema(
    {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
        studentCode: { type: String, required: true, unique: true },
        studentName: { type: String, required: true },
        lec: {
            day: { type: String },
            time: { type: Number },
        },
        sem: {
            day: { type: String },
            time: { type: Number },
        },
        lab: {
            day: { type: String },
            time: { type: Number },
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
