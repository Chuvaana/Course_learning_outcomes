const AssessmentPlan = require('../models/assessmentPlan.model');

exports.createPlan = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be an array of assessment plans' });
    }

    const savedPlans = await AssessmentPlan.insertMany(req.body);
    res.status(201).json(savedPlans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save assessment plans', detail: err.message });
  }
};

exports.getPlansByLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const plans = await AssessmentPlan.find({ lessonId });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans', detail: err.message });
  }
};

exports.updatePlansByLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updatedPlans = req.body;

    if (!Array.isArray(updatedPlans)) {
      return res.status(400).json({ error: 'Request body must be an array of assessment plans' });
    }

    // First, delete existing plans for this lesson
    await AssessmentPlan.deleteMany({ lessonId });

    // Then, insert the updated plans
    const savedPlans = await AssessmentPlan.insertMany(updatedPlans);

    res.status(200).json({ message: 'Assessment plans updated successfully', data: savedPlans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update assessment plans', detail: err.message });
  }
};
