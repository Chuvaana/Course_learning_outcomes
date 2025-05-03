const mongoose = require('mongoose');

const QuestionPoll = new mongoose.Schema({
  questionTitle: { type: String },
  questionType: { type: String, required: true },
  questionTypeName: { type: String, required: true },
  cloId: { type: String },
});

const PollQuestionsSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    groupName: { type: String, required: true },
    groupType: { type: String, required: true },
    questionList: [QuestionPoll],
  },
  { timestamps: true }
);

module.exports = mongoose.model('PollQuestions', PollQuestionsSchema);
