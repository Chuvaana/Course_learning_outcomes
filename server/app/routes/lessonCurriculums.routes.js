
module.exports = app => {
    const additionalController = require("../controllers/lessonCurriculums.controller");
    var router = require("express").Router();

    router.post("/", additionalController.createLessonCurriculum);
    router.get("/", additionalController.getAllLessonCurriculum);
    // router.get("/:id", additionalController.getCurriculumByLessonId);
    router.get("/:id", additionalController.getLessonCurriculumById);
    router.put("/:id", additionalController.updateLessonCurriculum);
    router.delete("/:id", additionalController.deleteLessonCurriculum);

    app.use("/api/lessonCurriculum", router);
};