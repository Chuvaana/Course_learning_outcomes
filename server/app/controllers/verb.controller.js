// controllers/verb.controller.js

const VerbCurriculum = require('../models/verb.model'); // Adjust path as needed

// Create a new Verb entry
exports.createVerb = async (req, res) => {
    try {
        const verb = new VerbCurriculum(req.body);
        const savedVerb = await verb.save();
        res.status(201).json(savedVerb);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Verb entries
exports.getVerbs = async (req, res) => {
    try {
        const verbs = await VerbCurriculum.find().populate('cloRelevance');
        res.status(200).json(verbs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific Verb by ID
exports.getVerbByItemCode = async (req, res) => {
    try {
        const verb = await VerbCurriculum.findById(req.params.id).populate('cloRelevance');
        if (!verb) {
            return res.status(404).json({ message: "Verb not found" });
        }
        res.status(200).json(verb);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Verb entry
exports.updateVerb = async (req, res) => {
    try {
        const updatedVerb = await VerbCurriculum.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('cloRelevance');
        if (!updatedVerb) {
            return res.status(404).json({ message: "Verb not found" });
        }
        res.status(200).json(updatedVerb);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Verb entry
exports.deleteVerb = async (req, res) => {
    try {
        const deletedVerb = await VerbCurriculum.findByIdAndDelete(req.params.item_code);
        if (!deletedVerb) {
            return res.status(404).json({ message: "Verb not found" });
        }
        res.status(200).json({ message: "Verb deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
