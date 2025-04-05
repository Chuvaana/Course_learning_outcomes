const LessonAssessment = require('../models/lessonAssessment.model');

// Create new assessment
exports.createAssessment = async (req, res) => {
  try {
    const assessment = new LessonAssessment(req.body);
    const saved = await assessment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Үнэлгээ үүсгэхэд алдаа гарлаа', error: err.message });
  }
};

// Get all assessments
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await LessonAssessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Үнэлгээнүүдийг авахад алдаа гарлаа', error: err.message });
  }
};

// Get assessment by ID
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await LessonAssessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Үнэлгээ олдсонгүй' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Үнэлгээг авахад алдаа гарлаа', error: err.message });
  }
};

// Update assessment
exports.updateAssessment = async (req, res) => {
  try {
    const updated = await LessonAssessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Үнэлгээ олдсонгүй' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Үнэлгээ шинэчлэхэд алдаа гарлаа', error: err.message });
  }
};

// Delete assessment
exports.deleteAssessment = async (req, res) => {
  try {
    const deleted = await LessonAssessment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Үнэлгээ олдсонгүй' });
    res.json({ message: 'Үнэлгээг амжилттай устгалаа' });
  } catch (err) {
    res.status(500).json({ message: 'Үнэлгээ устгахад алдаа гарлаа', error: err.message });
  }
};
