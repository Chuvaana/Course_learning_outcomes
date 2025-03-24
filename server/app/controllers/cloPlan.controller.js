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

// Get all cloPlans
exports.getCloByLessonId = async (req, res) => {
    try {
        const { id } = req.params;
        const cloPlans = await CloPlan.find({ lessonId: id }).populate("cloId");

        const cloPlanData = cloPlans.map(plan => ({
            cloId: plan.cloId ? plan.cloId._id : null,
            cloName: plan.cloId ? plan.cloId.cloName : null,
            cloType: plan.cloId ? plan.cloId.type : null,
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
            creationLevel: plan.creationLevel,
            id: plan.id
        }));
        res.json(cloPlanData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a CloPlan
exports.addCloPlan = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Input should be an array of CLO plans" });
        }
        req.body.forEach(async (item, index) => {
            const newCloPlan = new CloPlan(item);
            await newCloPlan.save();
        });
        res.status(201).json("success");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateCloPlan = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Input should be an array of CLO plans" });
        }

        const updatedCloPlans = [];

        for (const item of req.body) {
            const updatedCloPlan = await CloPlan.findByIdAndUpdate(item.id, item, { new: true });

            if (!updatedCloPlan) {
                return res.status(404).json({ message: `CloPlan with ID ${item.id} not found` });
            }

            updatedCloPlans.push(updatedCloPlan);
        }

        res.json(updatedCloPlans); // ✅ Send response only once, after all updates are done
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

        const cloPlans = await CloPlan.find().populate("cloId");

        // Format response
        const cloPlanData = cloPlans.map(plan => ({
            cloId: plan.cloId ? plan.cloId._id : null,
            cloName: plan.cloId ? plan.cloId.cloName : null,
            cloType: plan.cloId ? plan.cloId.type : null,
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
            creationLevel: plan.creationLevel,
            id: plan.id
        }));

        const responseData = [pointPlan, cloPlanData];
        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
