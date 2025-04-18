// controllers/cloPlanController.js
const CloPlan = require('../models/plan/cloPlan.model');

exports.saveCloPlans = async (req, res) => {
  try {
    const cloPlans = req.body;

    if (!Array.isArray(cloPlans)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Optional: Clean-up previous entries for the lesson
    const lessonId = cloPlans[0]?.lessonId;
    if (lessonId) {
      await CloPlan.deleteMany({ lessonId });
    }

    // Insert new CLO plans
    const savedPlans = await CloPlan.insertMany(cloPlans);
    res.status(201).json(savedPlans);
  } catch (err) {
    console.error('Error saving CLO plans:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get CLO plans by lessonId
exports.getCloPlansByLessonId = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const plans = await CloPlan.find({ lessonId });

    if (!plans.length) {
      return res.json([]);
    }

    res.json(plans);
  } catch (err) {
    console.error('Error fetching CLO plans:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCloPlan = async (req, res) => {
  try {
    const cloRows = req.body;

    const bulkOps = cloRows.map((clo) => ({
      updateOne: {
        filter: { lessonId: clo.lessonId, cloId: clo.cloId },
        update: {
          $set: {
            cloType: clo.cloType,
            procPoints: clo.procPoints,
            examPoints: clo.examPoints,
          },
        },
        upsert: true, // Хэрвээ байхгүй бол шинээр үүсгэнэ
      },
    }));

    const result = await CloPlan.bulkWrite(bulkOps);

    res.json({ message: 'CLO plans updated successfully.', result });
  } catch (err) {
    console.error('Error updating CLO plans:', err);
    res.status(500).json({ message: 'Server error while updating CLO plans.' });
  }
};

// ✅ Delete single CLO plan by _id
exports.deleteCloPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CloPlan.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'CLO plan not found.' });
    }

    res.json({ message: 'CLO plan deleted successfully.' });
  } catch (err) {
    console.error('Error deleting CLO plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
