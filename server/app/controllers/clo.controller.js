const Clo = require('../models/clo.model');

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
        console.log(req.body);
        const { lessonId, type, cloName } = req.body;

        if (!lessonId || !type || !cloName) {
            return res.status(400).json({ message: 'Type and CLO Name are required' });
        }

        const newClo = new Clo({ lessonId, type, cloName });
        await newClo.save();
        res.status(201).json(newClo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update CLO by ID
exports.updateClo = async (req, res) => {
    try {
        const { id, type, cloName } = req.body;

        const updatedClo = await Clo.findByIdAndUpdate(
            id,
            { type, cloName },
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

// Delete CLO by ID
exports.deleteClo = async (req, res) => {
    try {
        const deletedClo = await Clo.findByIdAndDelete(req.params.id);

        if (!deletedClo) {
            return res.status(404).json({ message: 'CLO not found' });
        }

        res.status(200).json({ message: 'CLO deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
