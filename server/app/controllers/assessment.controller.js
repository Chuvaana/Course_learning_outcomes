const Assessment = require('../models/assessment.model');

// Create Assessment
exports.createAssessment = async (req, res) => {
  try {
    const validAssessment = [];
    req.body.forEach(async (item, index) => {
      const assessment = new Assessment(item);
      validAssessment.push(assessment);
    });
    const savedAssessment = await Assessment.insertMany(validAssessment);
    res.status(201).json(savedAssessment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update Assessment
exports.updateAssessment = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const updatePromises = req.body.map(async (item) => {
      if (!item.id) {
        return { success: false, error: 'Missing ID in request item' };
      }
      try {
        const updatedAssessment = await Assessment.findByIdAndUpdate(item.id, item, { new: true });

        if (!updatedAssessment) {
          return { success: false, error: `Assessment with ID ${item.id} not found` };
        }

        return { success: true, updatedAssessment };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Use `Promise.allSettled` to ensure all updates are processed
    const results = await Promise.allSettled(updatePromises);

    const successfulUpdates = results
      .filter((r) => r.status === 'fulfilled' && r.value.success)
      .map((r) => r.value.updatedAssessment);

    const errors = results.filter((r) => r.status === 'fulfilled' && !r.value.success).map((r) => r.value.error);

    if (errors.length && successfulUpdates.length === 0) {
      return res.status(400).json({
        message: 'All updates failed',
        errors,
      });
    }

    res.status(errors.length ? 207 : 200).json({
      message: errors.length ? 'Some updates failed' : 'All CLO Plans updated successfully',
      updatedAssessments: successfulUpdates,
      errors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Assessments
exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('clo');
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Assessment by ID
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.find({ lessonId: req.params.id }).populate('clo');
    if (!assessment) return res.json([]);
    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Assessment
exports.deleteAssessment = async (req, res) => {
  try {
    const deletedAssessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!deletedAssessment) return res.status(404).json({ message: 'Assessment not found' });
    res.status(200).json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
