module.exports = app => {
    const assessmentController = require("../controllers/assessment.controller");
    var router = require("express").Router();

    router.post("/", assessmentController.createAssessment);
    router.get("/", assessmentController.getAssessments);
    router.get("/:id", assessmentController.getAssessmentById);
    router.put("/:id", assessmentController.updateAssessment);
    router.delete("/:id", assessmentController.deleteAssessment);

    app.use("/api/assessments", router);
};
