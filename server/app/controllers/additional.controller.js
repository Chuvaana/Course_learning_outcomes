const Additional = require('../models/additional.model');

// Create a new record
exports.createAdditional = async (req, res) => {
  try {
    const { lessonId, additional } = req.body;

    if (!Array.isArray(additional) || additional.length === 0) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const newRecord = new Additional({ lessonId, additional });
    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all records
exports.getAllAdditional = async (req, res) => {
  try {
    const records = await Additional.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single record by ID
exports.getAdditionalById = async (req, res) => {
  try {
    const record = await Additional.findOne({ lessonId: req.params.id });
    if (!record) {
      return res.json([]);
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a record
exports.updateAdditional = async (req, res) => {
  try {
    const { lessonId, additional } = req.body;

    if (!Array.isArray(additional) || additional.length === 0) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const updatedRecord = await Additional.findByIdAndUpdate(req.params.id, { lessonId, additional }, { new: true });

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a record
exports.deleteAdditional = async (req, res) => {
  try {
    const deletedRecord = await Additional.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
