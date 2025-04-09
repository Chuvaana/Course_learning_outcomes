// controllers/assessFooterController.js
const AssessFooter = require('../models/assessFooter.model');
const AssessFooterWeek = require('../models/assessFooterWeek.model');

// Create a new AssessFooter record
const createAssessFooter = async (req, res) => {
  try {
    // Assuming req.body is an array of AssessFooter objects
    const assessFooterArray = req.body;

    // Create an array of AssessFooter instances
    const newAssessFooters = await AssessFooter.insertMany(assessFooterArray);

    res.status(201).json(newAssessFooters); // Return the created documents
  } catch (error) {
    res.status(500).json({ message: 'Error creating AssessFooter', error });
  }
};

// Get all AssessFooter records
const getAllAssessFooters = async (req, res) => {
  try {
    const assessFooters = await AssessFooter.find();
    res.status(200).json(assessFooters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AssessFooters', error });
  }
};

// Get a single AssessFooter by lessonId
const getAssessFooterByLessonId = async (req, res) => {
  try {
    const assessFooter = await AssessFooter.find({ lessonId: req.params.lessonId });
    const assessFooterWeek = await AssessFooterWeek.find({ lessonId: req.params.lessonId });
    if (!assessFooter && !assessFooterWeek) {
      return res.json([]);
    }
    res.status(200).json({ assessFooter, assessFooterWeek });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AssessFooter', error });
  }
};

// Update an existing AssessFooter record
const updateAssessFooter = async (req, res) => {
  try {
    // Assuming req.body is an array of objects
    const assessFooterArray = req.body;

    const updatePromises = assessFooterArray.map(async (footer) => {
      return AssessFooter.findByIdAndUpdate(
        footer.id, // Use the provided id to find the document
        {
          lessonId: footer.lessonId, // Update the lessonId if needed
          name: footer.name,
          attendanceValue: footer.attendanceValue,
          assignmentValue: footer.assignmentValue,
          quizValue: footer.quizValue,
          projectValue: footer.projectValue,
          labValue: footer.labValue,
          examValue: footer.examValue,
        },
        { new: true } // Return the updated document
      );
    });

    // Wait for all update operations to complete
    const updatedAssessFooters = await Promise.all(updatePromises);

    // If no items were updated, return a 404 error
    if (updatedAssessFooters.every((item) => item === null)) {
      return res.status(404).json({ message: 'No AssessFooter entries found to update' });
    }

    // Return the updated entries
    res.status(200).json(updatedAssessFooters);
  } catch (error) {
    res.status(500).json({ message: 'Error updating AssessFooter', error });
  }
};

// Delete an AssessFooter record
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
