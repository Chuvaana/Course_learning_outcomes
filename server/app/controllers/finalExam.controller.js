// controllers/finalExam.controller.js

const FinalExamCurriculum = require('../models/finalExam.model'); // Update path as needed

// Create a new FinalExam entry
exports.createFinalExam = async (req, res) => {
  try {
    const finalExam = new FinalExamCurriculum(req.body);
    const savedFinalExam = await finalExam.save();
    res.status(201).json(savedFinalExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all FinalExam entries
exports.getFinalExams = async (req, res) => {
  try {
    const finalExams = await FinalExamCurriculum.find().populate('cloRelevance');
    res.status(200).json(finalExams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFinalExamQuestions = async (req, res) => {
  const { lessonId } = req.params;
  let { type } = req.query;
  try {
    const assessments = await FinalExamCurriculum.find({ lessonId, finalExamName: type });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({
      message: 'Үнэлгээнүүдийг авахад алдаа гарлаа',
      error: err.message,
    });
  }
};

// Get a specific FinalExam by ID
exports.getFinalExamByItemCode = async (req, res) => {
  try {
    const finalExam = await FinalExamCurriculum.findById(req.params.id).populate('cloRelevance');
    if (!finalExam) {
      return res.status(404).json({ message: 'Final exam not found' });
    }
    res.status(200).json(finalExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a FinalExam entry
exports.updateFinalExam = async (req, res) => {
  try {
    const existingExam = await FinalExamCurriculum.findOne({
      lessonId: req.body.lessonId,
      finalExamName: req.body.finalExamName,
    });

    if (!existingExam) {
      // Шинээр үүсгэх
      const newFinalExam = new FinalExamCurriculum(req.body);
      const savedFinalExam = await newFinalExam.save();
      return res.status(201).json(savedFinalExam);
    } else {
      // Шууд объект дээр утгуудыг шинэчилж хадгалах
      Object.assign(existingExam, req.body);
      const updatedFinalExam = await existingExam.save();
      return res.status(200).json(updatedFinalExam);
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Final exam хадгалах үед алдаа гарлаа',
      error: error.message,
    });
  }
};

// Delete a FinalExam entry
exports.deleteFinalExam = async (req, res) => {
  try {
    const deletedFinalExam = await FinalExamCurriculum.findByIdAndDelete(req.params.item_code);
    if (!deletedFinalExam) {
      return res.status(404).json({ message: 'Final exam not found' });
    }
    res.status(200).json({ message: 'Final exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
