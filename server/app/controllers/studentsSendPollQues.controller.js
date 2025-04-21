const StudentsSendPollQues = require('../models/StudentsSendPollQues.model');

// Create a new record
exports.createStudentsSendPollQues = async (req, res) => {
  try {
    const newEntry = new StudentsSendPollQues(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry', error });
  }
};

// Get all records
exports.getAllStudentsSendPollQuess = async (req, res) => {
  try {
    const entries = await StudentsSendPollQues.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries', error });
  }
};

// Get records by lessonId
exports.getAllLessonStudentsSendPollQues = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const entries = await StudentsSendPollQues.find({ lessonId });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries by lessonId', error });
  }
};

// Get records by studentId
exports.getAllStudentsSendPollQues = async (req, res) => {
  try {
    const { studentId } = req.params;
    const entries = await StudentsSendPollQues.find({ studentId });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries by studentId', error });
  }
};

// Get record by MongoDB _id
exports.getStudentsSendPollQuesById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await StudentsSendPollQues.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entry by ID', error });
  }
};

// Update a record by _id
exports.updateStudentsSendPollQues = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await StudentsSendPollQues.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry', error });
  }
};

// Delete a record by _id
exports.deleteStudentsSendPollQues = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StudentsSendPollQues.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error });
  }
};
