const mongoose = require('mongoose');

const QuestionPoll = new mongoose.Schema({
  answerId: { type: Number, required: true },
  answerValue: { type: Number, required: true },
  point: {type: Number},
  answerName: { type: String},
    questionType: { type: String, required: true },
    questionTypeName: { type: String, required: true },
});

const PollQuestionsSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  studentId: { type: String},
  pollQuestionId: { type: String, required: true },
  questionSubName: { type: String, required: true },
  questionName: { type: String, required: true },
  totalPoint: { type: Number, required: true },
  dateOfReplyTime: { type: String, required: true },
  answers: [QuestionPoll],
}, { timestamps: true });

module.exports = mongoose.model('PollQuestions', PollQuestionsSchema);
