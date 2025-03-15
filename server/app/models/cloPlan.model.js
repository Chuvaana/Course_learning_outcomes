const mongoose = require('mongoose');

const CloPlanSchema = new mongoose.Schema(
    {
        clo: { type: mongoose.Schema.Types.ObjectId, ref: 'Clo', required: true }, // Changed from "clos" to "clo" (singular)
        timeManagement: { type: Number, default: 0 },
        engagement: { type: Number, default: 0 },
        recall: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        recall2: { type: Number, default: 0 },
        problemSolving2: { type: Number, default: 0 },
        toExp: { type: Number, default: 0 },
        processing: { type: Number, default: 0 },
        decisionMaking: { type: Number, default: 0 },
        formulation: { type: Number, default: 0 },
        analysis: { type: Number, default: 0 },
        implementation: { type: Number, default: 0 },
        understandingLevel: { type: Number, default: 0 },
        analysisLevel: { type: Number, default: 0 },
        creationLevel: { type: Number, default: 0 }
    },
    { timestamps: true } // Added timestamps
);

// Convert _id to id in JSON responses
CloPlanSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id.toString(); // Convert _id to string
    return object;
});

module.exports = mongoose.model('CloPlan', CloPlanSchema);
