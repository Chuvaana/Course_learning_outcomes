const PollQuestions = require('../models/PollQuestions.model.js');

// Create a new PollQuestion
exports.createPollQuestions = async (req, res) => {
  try {
    console.log(req.body);
    const pollQuestion = new PollQuestions(req.body);
    const savedPollQuestion = await pollQuestion.save();
    res.status(201).json(savedPollQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all PollQuestions
exports.getAllPollQuestionss = async (req, res) => {
  try {
    const pollQuestions = await PollQuestions.find();
    res.status(200).json(pollQuestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPollQuestions = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const assessments = await PollQuestions.find({ lessonId });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ 
      message: 'Үнэлгээнүүдийг авахад алдаа гарлаа', 
      error: err.message 
    });
  }
};

// Get PollQuestion by ID
exports.getPollQuestionsById = async (req, res) => {
  try {
    const pollQuestion = await PollQuestions.findById(req.params.id);
    if (!pollQuestion) {
      return res.status(404).json({ message: "PollQuestion not found" });
    }
    res.status(200).json(pollQuestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update PollQuestion by ID
exports.updatePollQuestions = async (req, res) => {
  try {
    const updatedPollQuestion = await PollQuestions.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPollQuestion) {
      return res.status(404).json({ message: "PollQuestion not found" });
    }
    res.status(200).json(updatedPollQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete PollQuestion by ID
exports.deletePollQuestions = async (req, res) => {
  try {
    const deletedPollQuestion = await PollQuestions.findByIdAndDelete(req.params.id);
    if (!deletedPollQuestion) {
      return res.status(404).json({ message: "PollQuestion not found" });
    }
    res.status(200).json({ message: "PollQuestion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
