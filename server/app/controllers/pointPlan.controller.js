const PointPlan = require('../models/pointPlan.model');

// Get all pointPlan
exports.getPointPlan = async (req, res) => {
    try {
        const pointPlan = await PointPlan.find();
        res.json(pointPlan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Get all pointPlan
exports.getPointPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const pointPlan = await PointPlan.findOne({ lessonId: id });
        console.log(id, pointPlan);
        res.json(pointPlan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a PointPlan
exports.addPointPlan = async (req, res) => {
    try {
        const newPointPlan = new PointPlan(req.body);
        await newPointPlan.save();
        res.status(201).json(newPointPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a PointPlan by ID
exports.updatePointPlan = async (req, res) => {
    try {
        const updatedPointPlan = await PointPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPointPlan) return res.status(404).json({ message: "PointPlan not found" });
        res.json(updatedPointPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a PointPlan by ID
// exports.deletePointPlan = async (req, res) => {
//     try {
//         const deletedPointPlan = await PointPlan.findByIdAndDelete(req.params.id);
//         if (!deletedPointPlan) return res.status(404).json({ message: "PointPlan not found" });
//         res.json({ message: "PointPlan deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
