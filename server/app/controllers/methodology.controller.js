const Methodology = require('../models/methodology.model');

// Get all methodologies
exports.getAllMethodologies = async (req, res) => {
    try {
        const methodologies = await Methodology.find().populate('cloRelevance'); // Populate CLO details
        res.status(200).json(methodologies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get methodology by ID
exports.getMethodologyById = async (req, res) => {
    try {
        const methodology = await Methodology.findById(req.params.id).populate('cloRelevance');
        if (!methodology) return res.status(404).json({ message: 'Methodology not found' });
        res.status(200).json(methodology);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new methodology
exports.createMethodology = async (req, res) => {
    try {
        const { lessonId, pedagogy, deliveryMode, cloRelevance } = req.body;

        // Ensure cloRelevance is an array of strings
        if (!Array.isArray(cloRelevance) || cloRelevance.some(item => typeof item !== 'string')) {
            return res.status(400).json({ message: "Invalid cloRelevance format. It must be an array of strings." });
        }

        const newMethodology = new Methodology({
            lessonId,
            pedagogy,
            deliveryMode,
            cloRelevance // Storing as an array of strings
        });

        await newMethodology.save();
        res.status(201).json(newMethodology);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update a methodology
exports.updateMethodology = async (req, res) => {
    try {
        const { lessonId, pedagogy, deliveryMode, cloRelevance } = req.body;
        const updatedMethodology = await Methodology.findByIdAndUpdate(
            req.params.id,
            { lessonId, pedagogy, deliveryMode, cloRelevance },
            { new: true, runValidators: true }
        );
        if (!updatedMethodology) return res.status(404).json({ message: 'Methodology not found' });
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
