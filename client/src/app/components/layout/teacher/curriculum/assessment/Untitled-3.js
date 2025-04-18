const AssessFooter = require('../models/assessFooter.model');
const AssessFooter1 = require('../models/assessFooter.model');

// Create new AssessFooter records
const createAssessFooter = async (req, res) => {
  try {
    const { assessFooter, assessFooter1 } = req.body;

    const newAssessFooters = await AssessFooter.insertMany(assessFooter || []);
    const newAssessFooters1 = await AssessFooter1.insertMany(assessFooter1 || []);

    res.status(201).json({
      assessFooter: newAssessFooters,
      assessFooter1: newAssessFooters1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating AssessFooter', error });
  }
};

// Get all AssessFooter records
const getAllAssessFooters = async (req, res) => {
  try {
    const assessFooters = await AssessFooter.find();
    const assessFooters1 = await AssessFooter1.find();

    res.status(200).json({
      assessFooter: assessFooters,
      assessFooter1: assessFooters1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AssessFooters', error });
  }
};

// Get AssessFooter by lessonId
const getAssessFooterByLessonId = async (req, res) => {
  try {
    console.log('req.params.lessonId' + req.params.lessonId);
    const assessFooter = await AssessFooter.find({ lessonId: req.params.lessonId });
    console.log('assessFooter' + assessFooter);
    const assessFooter1 = await AssessFooter1.find({ lessonId: req.params.lessonId });
    console.log('assessFooter1' + assessFooter1);

    res.status(200).json({
      assessFooter,
      assessFooter1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AssessFooter', error });
  }
};

// Update AssessFooter records
const updateAssessFooter = async (req, res) => {
  try {
    const { assessFooterArray = [], assessFooterArray1 = [] } = req.body;

    const updatePromises = assessFooterArray.map((footer) =>
      AssessFooter.findByIdAndUpdate(
        footer.id,
        {
          lessonId: footer.lessonId,
          name: footer.name,
          attendanceValue: footer.attendanceValue,
          assignmentValue: footer.assignmentValue,
          quizValue: footer.quizValue,
          projectValue: footer.projectValue,
          labValue: footer.labValue,
          examValue: footer.examValue,
        },
        { new: true }
      )
    );

    const updatePromises1 = assessFooterArray1.map((footer) =>
      AssessFooter1.findByIdAndUpdate(
        footer.id,
        {
          lessonId: footer.lessonId,
          name: footer.name,
          attendanceValue: footer.attendanceValue,
          assignmentValue: footer.assignmentValue,
          quizValue: footer.quizValue,
          projectValue: footer.projectValue,
          labValue: footer.labValue,
          examValue: footer.examValue,
        },
        { new: true }
      )
    );

    const updatedAssessFooters = await Promise.all(updatePromises);
    const updatedAssessFooters1 = await Promise.all(updatePromises1);

    res.status(200).json({
      assessFooter: updatedAssessFooters,
      assessFooter1: updatedAssessFooters1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating AssessFooter', error });
  }
};

// Delete a single AssessFooter by ID
const deleteAssessFooter = async (req, res) => {
  try {
    const deletedAssessFooter = await AssessFooter.findByIdAndDelete(req.params.id);
    if (!deletedAssessFooter) {
      return res.status(404).json({ message: 'AssessFooter not found' });
    }
    res.status(200).json({ message: 'AssessFooter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting AssessFooter', error });
  }
};

module.exports = {
  createAssessFooter,
  getAllAssessFooters,
  getAssessFooterByLessonId,
  updateAssessFooter,
  deleteAssessFooter,
};
