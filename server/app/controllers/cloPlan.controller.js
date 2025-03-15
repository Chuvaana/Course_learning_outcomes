const CloPlan = require('../models/cloPlan.model');
const PointPlan = require('../models/pointPlan.model');
const Clo = require('../models/clo.model');

// Get all cloPlans
exports.getAllCLOs = async (req, res) => {
    try {
        const cloPlans = await CloPlan.find();
        res.json(cloPlans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a CloPlan
exports.addCloPlan = async (req, res) => {
    try {
        const newCloPlan = new CloPlan(req.body);
        await newCloPlan.save();
        res.status(201).json(newCloPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a CloPlan by ID
exports.updateCloPlan = async (req, res) => {
    try {
        const updatedCloPlan = await CloPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCloPlan) return res.status(404).json({ message: "CloPlan not found" });
        res.json(updatedCloPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a CloPlan by ID
exports.deleteCloPlan = async (req, res) => {
    try {
        const deletedCloPlan = await CloPlan.findByIdAndDelete(req.params.id);
        if (!deletedCloPlan) return res.status(404).json({ message: "CloPlan not found" });
        res.json({ message: "CloPlan deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCloPlan = async (req, res) => {
    try {
        const pointPlan = await PointPlan.find();
        console.log("pointPlan" + pointPlan);
        const cloPlans = await CloPlan.find();

        console.log("cloPlans" + cloPlans);

        // Format response
        const cloPlanData = cloPlans.map(plan => ({
            cloName: plan.clo ? plan.clo.cloName : null,
            cloType: plan.clo ? plan.clo.cloType : null,
            timeManagement: plan.timeManagement,
            engagement: plan.engagement,
            recall: plan.recall,
            problemSolving: plan.problemSolving,
            recall2: plan.recall2,
            problemSolving2: plan.problemSolving2,
            toExp: plan.toExp,
            processing: plan.processing,
            decisionMaking: plan.decisionMaking,
            formulation: plan.formulation,
            analysis: plan.analysis,
            implementation: plan.implementation,
            understandingLevel: plan.understandingLevel,
            analysisLevel: plan.analysisLevel,
            creationLevel: plan.creationLevel
        }));

        console.log("cloPlanData" + cloPlanData);

        const responseData = [pointPlan, cloPlanData];
        console.log("responseData" + responseData);

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
