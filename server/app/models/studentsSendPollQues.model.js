const mongoose = require('mongoose');

const Question = new mongoose.Schema({
  questionTitle: { type: String, required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clo', default: null },
  questionId: { type: String, required: true },
  answerValue: { type: String, required: true },
  questionType: { type: String, required: true },
  questionTypeName: { type: String, required: true },
});

const SubQuestions = new mongoose.Schema({
  questionGroupName: { type: String, required: true },
  questionList: [Question],
});

const StudentsSendPollQuesSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  studentId: { type: String, required: true },
  pollQuestionId: { type: String, required: true },
  SubQuestions: [SubQuestions],
}, { timestamps: true });

module.exports = mongoose.model('StudentsSendPollQues', StudentsSendPollQuesSchema);
