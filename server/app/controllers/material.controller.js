const Material = require('../models/material.model');

// ✅ Add Materials (Create)
exports.addMaterial = async (req, res) => {
    try {
        const { lessonCode, mainBooks, extraMaterials, webLinks, libraryLink, softwareTools } = req.body;

        const newMaterial = new Material({
            lessonCode,
            mainBooks,
            extraMaterials,
            webLinks,
            libraryLink,
            softwareTools
        });

        await newMaterial.save();
        res.status(201).json({ message: 'Materials saved successfully', material: newMaterial });
    } catch (error) {
        res.status(500).json({ message: 'Error saving materials', error });
    }
};

// ✅ Get Materials by Lesson Code (Read)
exports.getMaterialsByLessonCode = async (req, res) => {
    try {
        const { lessonCode } = req.params;
        const material = await Material.findOne({ lessonCode });

        if (!material) {
            return res.status(404).json({ message: 'No materials found for this lesson' });
        }

        res.json(material);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving materials', error });
    }
};

// ✅ Update Materials (Update)
exports.updateMaterial = async (req, res) => {
    try {
        const { lessonCode } = req.params;
        const updatedData = req.body;

        const updatedMaterial = await Material.findOneAndUpdate({ lessonCode }, updatedData, { new: true });

        if (!updatedMaterial) {
            return res.status(404).json({ message: 'Materials not found' });
        }

        res.json({ message: 'Materials updated successfully', material: updatedMaterial });
    } catch (error) {
        res.status(500).json({ message: 'Error updating materials', error });
    }
};

// ✅ Delete Materials (Delete)
exports.deleteMaterial = async (req, res) => {
    try {
        const { lessonCode } = req.params;
        const deletedMaterial = await Material.findOneAndDelete({ lessonCode });

        if (!deletedMaterial) {
            return res.status(404).json({ message: 'Materials not found' });
        }

        res.json({ message: 'Materials deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting materials', error });
    }
};
