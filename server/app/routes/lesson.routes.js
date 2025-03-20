module.exports = app => {
    const lessonController = require('../controllers/lesson.controller');
    var router = require("express").Router();

    console.log("tt");

    router.post('/', lessonController.createLesson);
    router.get('/', lessonController.getAllLessons);
    router.get('/:id', lessonController.getLessonById);
    router.put('/:id', lessonController.updateLesson);
    router.delete('/:id', lessonController.deleteLesson);

    app.use("/api/lesson", router);
};
