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

    try {
        const assessments = await FinalExamCurriculum.find({ lessonId });
        res.json(assessments);
    } catch (err) {
        res.status(500).json({
            message: 'Үнэлгээнүүдийг авахад алдаа гарлаа',
            error: err.message
        });
    }
};

// Get a specific FinalExam by ID
exports.getFinalExamByItemCode = async (req, res) => {
    try {
        const finalExam = await FinalExamCurriculum.findById(req.params.id).populate('cloRelevance');
        if (!finalExam) {
            return res.status(404).json({ message: "Final exam not found" });
        }
        res.status(200).json(finalExam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a FinalExam entry
exports.updateFinalExam = async (req, res) => {
    try {
        const updatedFinalExam = await FinalExamCurriculum.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFinalExam) {
            return res.status(404).json({ message: "Final exam not found" });
        }
        res.status(200).json(updatedFinalExam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a FinalExam entry
exports.deleteFinalExam = async (req, res) => {
    try {
        const deletedFinalExam = await FinalExamCurriculum.findByIdAndDelete(req.params.item_code);
        if (!deletedFinalExam) {
            return res.status(404).json({ message: "Final exam not found" });
        }
        res.status(200).json({ message: "Final exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
