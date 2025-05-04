const Clo = require('../models/clo.model');

const mongoose = require('mongoose');
const Methodology = require('../models/methodology.model');
const FinalExam = require('../models/finalExam.model');
const Schedule = require('../models/schedule.model');
const ScheduleBd = require('../models/scheduleBd.model');
const ScheduleLab = require('../models/scheduleLab.model');
const ScheduleSem = require('../models/scheduleSem.model');

// Get all CLOs
exports.getClos = async (req, res) => {
  try {
    const clos = await Clo.find();
    res.status(200).json(clos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCloById = async (req, res) => {
  try {
    const id = req.params.id;
    const clos = await Clo.find({ lessonId: id });
    if (!clos) {
      return res.json([]);
    }
    res.status(200).json(clos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Add a new CLO
exports.addClo = async (req, res) => {
  try {
    const { lessonId, type, cloName, knowledge, skill, attitude } = req.body;

    if (!lessonId || !type || !cloName) {
      return res.status(400).json({ message: 'Type and CLO Name are required' });
    }

    const newClo = new Clo({ lessonId, type, cloName, knowledge, skill, attitude });
    await newClo.save();
    res.status(201).json(newClo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update CLO by ID
exports.updateClo = async (req, res) => {
  try {
    const { id, type, cloName, knowledge, skill, attitude } = req.body;

    const updatedClo = await Clo.findByIdAndUpdate(
      id,
      { type, cloName, knowledge, skill, attitude },
      { new: true, runValidators: true }
    );

    if (!updatedClo) {
      return res.status(404).json({ message: 'CLO not found' });
    }

    res.status(200).json(updatedClo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClo = async (req, res) => {
  try {
    const cloId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(cloId);

    const modelsToCheck = [
      { model: Methodology, name: 'Сургах, суралцах арга зүй' },
      { model: FinalExam, name: 'Улирлын шалгалт' },
      { model: Schedule, name: 'Лекцийн цагийн хуваарилалт' },
      { model: ScheduleBd, name: 'Бие даалтын цагийн хуваарилалт' },
      { model: ScheduleLab, name: 'Лабораторын цагийн хуваарилалт' },
      { model: ScheduleSem, name: 'Семинарын цагийн хуваарилалт' },
    ];

    for (const { model, name } of modelsToCheck) {
      const exists = await model.exists({ cloRelevance: objectId });
      if (exists) {
        return res.status(400).json({
          message: `CLO-г "${name}" дээр ашиглаж байгаа тул устгах боломжгүй.`,
        });
      }
    }

    const deleted = await Clo.findByIdAndDelete(cloId);
    if (!deleted) {
      return res.status(404).json({ message: 'CLO олдсонгүй' });
    }

    res.json({ message: 'CLO амжилттай устгалаа' });
  } catch (error) {
    console.error('CLO устгах алдаа:', error);
    res.status(500).json({ message: 'Устгах үед алдаа гарлаа', error });
  }
};
