// controllers/feedbackTaskController.js
const FeedbackTask = require('../models/feedbackTask.model');

// Create a new feedback task
exports.createTask = async (req, res) => {
  try {
    const tasks = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Request body must be an array of tasks' });
    }

    const createdTasks = await FeedbackTask.insertMany(tasks);
    res.status(201).json(createdTasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all feedback tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await FeedbackTask.find({ lessonId: req.params.id });
    if (!tasks) {
      return res.status(404).json([]);
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTasks = await Promise.all(
      req.body.map(({ _id, ...updateData }) => FeedbackTask.findByIdAndUpdate(_id, updateData, { new: true }))
    );
    res.json(updatedTasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a feedback task by ID
exports.deleteTask = async (req, res) => {
  try {
    await FeedbackTask.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
