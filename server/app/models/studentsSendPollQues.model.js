const mongoose = require('mongoose');

const Question = new mongoose.Schema({
  answerId: { type: Number, required: true },
  answerValue: { type: String, required: true },
  point: {type: Number},
  answerName: { type: String},
  questionType: { type: String, required: true },
  questionTypeName: { type: String, required: true },
});

const SubQuestions = new mongoose.Schema({
  lessonId: { type: String, required: true },
  studentId: { type: String, required: true },
  pollQuestionId: { type: String, required: true },
  questionSubName: { type: String, required: true },
  questionName: { type: String},
  dateOfReplyTime: { type: String, required: true },
  answers: [Question],
});

const StudentsSendPollQuesSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  studentId: { type: String, required: true },
  pollQuestionId: { type: String, required: true },
  SubQuestions: [SubQuestions],
}, { timestamps: true });

module.exports = mongoose.model('StudentsSendPollQues', StudentsSendPollQuesSchema);
