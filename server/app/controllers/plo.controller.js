// controllers/plo.controller.js

const PloCurriculum = require('../models/plo.model'); // Update path as needed

// Create a new PLO entry
exports.createPlo = async (req, res) => {
    try {
        const plo = new PloCurriculum(req.body);
        const savedPlo = await plo.save();
        res.status(201).json(savedPlo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all PLO entries
exports.getPlos = async (req, res) => {
    try {
        const plos = await PloCurriculum.find();
        res.status(200).json(plos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific PLO by ID
exports.getPloByItemCode = async (req, res) => {
    try {
        const plo = await PloCurriculum.findById(req.params.id);
        if (!plo) {
            return res.status(404).json({ message: "PLO not found" });
        }
        res.status(200).json(plo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a PLO entry
exports.updatePlo = async (req, res) => {
    try {
        const updatedPlo = await PloCurriculum.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPlo) {
            return res.status(404).json({ message: "PLO not found" });
        }
        res.status(200).json(updatedPlo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a PLO entry by item_code (assuming it's stored in `_id`)
exports.deletePlo = async (req, res) => {
    try {
        const deletedPlo = await PloCurriculum.findByIdAndDelete(req.params.item_code);
        if (!deletedPlo) {
            return res.status(404).json({ message: "PLO not found" });
        }
        res.status(200).json({ message: "PLO deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
