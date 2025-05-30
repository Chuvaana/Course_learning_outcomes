const mongoose = require('mongoose');

const Question = new mongoose.Schema({
  questionTitle: { type: String, required: true },
  cloId: { type: String },
  answerValue: { type: String, required: true },
  questionType: { type: String, required: true },
  questionTypeName: { type: String, required: true },
});

const SubQuestions = new mongoose.Schema({
  groupId: { type: String, required: true },
  groupName: { type: String, required: true },
  groupType: { type: String, required: true },
  questionList: [Question],
});

const StudentsSendPollQuesSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    studentId: { type: String, required: true },
    groupList: [SubQuestions],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentsSendPollQues', StudentsSendPollQuesSchema);
