const mongoose = require('mongoose');
const AssessmentPlan = require('../models/assessmentPlan.model');

exports.createPlan = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be an array of assessment plans' });
    }

    // lessonId-г бүгдээр шалгах
    if (!req.body.every((plan) => plan.lessonId.toString() === req.body[0].lessonId.toString())) {
      return res.status(400).json({ error: 'All assessment plans must have the same lessonId' });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const lessonId = req.params.id;
    const updatedPlans = req.body;

    if (!Array.isArray(updatedPlans)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Request body must be an array of assessment plans' });
    }

    // lessonId шалгах
    if (!updatedPlans.every((plan) => plan.lessonId.toString() === lessonId.toString())) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'All assessment plans must have the same lessonId as in URL' });
    }

    // Хуучин бичлэгүүдийг устгах
    await AssessmentPlan.deleteMany({ lessonId }).session(session);

    // Шинэчилсэн бичлэгүүдийг хадгалах
    const savedPlans = await AssessmentPlan.insertMany(updatedPlans, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Assessment plans updated successfully', data: savedPlans });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: 'Failed to update assessment plans', detail: err.message });
  }
};
