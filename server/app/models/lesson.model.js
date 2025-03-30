const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  lessonName: { type: String, required: true },
  lessonCode: { type: String, required: true },
  lessonCredit: { type: Number, required: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  department: { type: String, required: true },
  prerequisite: { type: String },
  assistantTeacher: {
    name: { type: String },
    room: { type: String },
    email: { type: String, match: /^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/ },
    phone: { type: Number }
  },
  teacher: {
    name: { type: String, required: true },
    room: { type: String, required: true },
    email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@must\.edu\.mn$/ },
    phone: { type: Number, required: true }
  },
  lessonLevel: { type: String, required: true, enum: ['BACHELOR', 'MAGISTER', 'DOCTOR'] },
  lessonType: { type: String, required: true, enum: ['REQ', 'CHO'] },
  recommendedSemester: { type: String, required: true },
  weeklyHours: {
    lecture: { type: Number },
    seminar: { type: Number },
    lab: { type: Number },
    assignment: { type: Number },
    practice: { type: Number }
  },
  totalHours: {
    lecture: { type: Number },
    seminar: { type: Number },
    lab: { type: Number },
    assignment: { type: Number },
    practice: { type: Number },
  },
  selfStudyHours: {
    lecture: { type: Number },
    seminar: { type: Number },
    lab: { type: Number },
    assignment: { type: Number },
    practice: { type: Number },
  }
}, { timestamps: true });

LessonSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model('Lesson', LessonSchema);
