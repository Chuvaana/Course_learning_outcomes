const mongoose = require('mongoose');

const QuestionPoll = new mongoose.Schema({
  totalPoint: { type: Number },
  point: { type: Number },
  questionTitle: { type: String },
  answerValue: { type: Number, required: true },
  questionType: { type: String, required: true },
  questionTypeName: { type: String, required: true },
});

const PollQuestionsSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    groupName: { type: String, required: true },
    questionType: { type: String, required: true },
    questionList: [QuestionPoll],
  },
  { timestamps: true }
);

module.exports = mongoose.model('PollQuestions', PollQuestionsSchema);
