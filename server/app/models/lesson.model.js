const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Хичээлийн нэр
  code: { type: String, required: true, unique: true }, // Хичээлийн код
  credit: { type: Number, required: true }, // Хичээлийн кредит
  type: { type: String, required: true }, // Хичээлийн төрөл
  department: { type: String, required: true }, // Харьяалагдах салбар/Тэнхим
  schedule: {
    lecture: { type: Number, required: true }, // Лекц цаг
    seminar: { type: Number, required: true }, // Семинар цаг
    laboratory: { type: Number, required: true }, // Лаборатори цаг
    selfStudy: { type: Number, required: true }, // Бие даан суралцах цаг
    totalHours: { type: Number, required: true } // Нийт сургалтын цаг
  }
});

LessonSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model('Lesson', LessonSchema);
