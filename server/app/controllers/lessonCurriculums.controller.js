const LessonCurriculum = require('../models/lessonCurriculums.model');

// CREATE - Add new lesson curriculum
exports.createLessonCurriculum = async (req, res) => {
  try {
    const newCurriculum = new LessonCurriculum(req.body);
    const saved = await newCurriculum.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all lesson curriculums  
exports.getAllLessonCurriculum = async (req, res) => {
  try {
    const curriculums = await LessonCurriculum.find().populate('lessonId');
    res.status(200).json(curriculums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurriculumByLessonId = async (req, res) => {
  const { lessonId } = req.params;
    const curriculums = await LessonCurriculum.find({ lessonId }).populate('lessonId');
    res.json(assessments);
    console.log(assessments);

    // if (!curriculum) return res.status(404).json({ message: "Not found" });
    // res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get one by ID
exports.getLessonCurriculumById = async (req, res) => {
  try {
    const curriculum = await LessonCurriculum.findById(req.params.id).populate('lessonId');
    if (!curriculum) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Update by ID
exports.updateLessonCurriculum = async (req, res) => {
  try {
    const updated = await LessonCurriculum.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove by ID
exports.deleteLessonCurriculum = async (req, res) => {
  try {
    const deleted = await LessonCurriculum.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
