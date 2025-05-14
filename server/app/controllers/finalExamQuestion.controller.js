const FinalExamQuestion = require('../models/finalExamQuestion.model');
const FinalExamCurriculum = require('../models/finalExam.model'); // Update path as needed

// Create a new final exam question
exports.createFinalExamQuestion = async (req, res) => {
  try {
    delete req.body._id; // remove manually
    const newQuestion = new FinalExamQuestion(req.body);
    const savedQuestion = await newQuestion.save();

    console.log(savedQuestion);
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: 'Error creating question', error: error.message });
  }
};

// Get all final exam questions
exports.getFinalExamQuestions = async (req, res) => {
  try {
    const questions = await FinalExamQuestion.find().populate('verb').populate('cloCode');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

exports.getAllFinalExamQuestions = async (req, res) => {
  const { lessonId } = req.params;
  let { type } = req.query;
  console.log(type);

  try {
    const assessments = await FinalExamQuestion.find({ lessonId, finalExamType: type });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({
      message: 'Үнэлгээнүүдийг авахад алдаа гарлаа',
      error: err.message,
    });
  }
};

// Get a final exam question by ID
exports.getFinalExamQuestionByItemCode = async (req, res) => {
  try {
    const question = await FinalExamQuestion.findById(req.params.id).populate('verb').populate('cloCode');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving question', error: error.message });
  }
};

// Update a final exam question
exports.updateFinalExamQuestion = async (req, res) => {
  try {
    const updatedQuestion = await FinalExamQuestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: 'Error updating question', error: error.message });
  }
};
const mongoose = require('mongoose');

exports.deleteFinalExamQuestion = async (req, res) => {
  try {
    const questionIdToRemove = req.params.item_code;
    const finalExamId = req.params.id;

    // Convert to ObjectId
    const objectIdToRemove = new mongoose.Types.ObjectId(questionIdToRemove);

    // Pull from finalExamQuestion array
    const updatedFinalExam = await FinalExamCurriculum.findByIdAndUpdate(
      finalExamId,
      { $pull: { finalExamQuestion: objectIdToRemove } },
      { new: true }
    );

    if (!updatedFinalExam) {
      return res.status(404).json({ message: 'FinalExam not found' });
    }

    // Delete the actual question document
    const deletedQuestion = await FinalExamQuestion.findByIdAndDelete(objectIdToRemove);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question removed from finalExam and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};
