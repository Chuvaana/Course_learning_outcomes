const mongoose = require('mongoose');
const Methodology = require('../models/methodology.model');

exports.getMethodologies = async (req, res) => {
    try {
        const methodologies = await Methodology.find()
            .populate('cloRelevance', 'cloName')
            .exec();

        res.status(200).json(methodologies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getMethodologyById = async (req, res) => {
    try {
        const methodology = await Methodology.find({ lessonId: req.params.id })
            .populate('cloRelevance', 'cloName')
            .exec();

        if (!methodology) {
            return res.json([]);
        }

        res.status(200).json(methodology);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMethodology = async (req, res) => {
    try {
        const { lessonId, pedagogy, deliveryMode, cloRelevance } = req.body;

        if (cloRelevance && (!Array.isArray(cloRelevance) || cloRelevance.some(id => !mongoose.Types.ObjectId.isValid(id)))) {
            return res.status(400).json({ message: "Invalid CLO IDs." });
        }

        const newMethodology = new Methodology({
            lessonId,
            pedagogy,
            deliveryMode,
            cloRelevance: cloRelevance || []
        });

        await newMethodology.save();
        res.status(201).json(newMethodology);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMethodology = async (req, res) => {
    try {
        const { lessonId, pedagogy, deliveryMode, cloRelevance } = req.body;

        if (cloRelevance && (!Array.isArray(cloRelevance) || cloRelevance.some(id => !mongoose.Types.ObjectId.isValid(id)))) {
            return res.status(400).json({ message: "Invalid CLO IDs." });
        }

        const updatedMethodology = await Methodology.findByIdAndUpdate(
            req.params.id,
            {
                lessonId,
                pedagogy,
                deliveryMode,
                cloRelevance: cloRelevance || []
            },
            { new: true, runValidators: true }
        );

        if (!updatedMethodology) {
            return res.status(404).json({ message: 'Methodology not found' });
        }

        res.status(200).json(updatedMethodology);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a methodology
exports.deleteMethodology = async (req, res) => {
    try {
        const deletedMethodology = await Methodology.findByIdAndDelete(req.params.id);
        if (!deletedMethodology) return res.status(404).json({ message: 'Methodology not found' });
        res.status(200).json({ message: 'Methodology deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
