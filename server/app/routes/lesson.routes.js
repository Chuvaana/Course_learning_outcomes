module.exports = app => {
    const lessonController = require('../controllers/lesson.controller');
    var router = require("express").Router();

    router.post('/', lessonController.createLesson);
    router.get('/', lessonController.getLessons);
    router.get('/:id', lessonController.getLessonById);
    router.put('/:id', lessonController.updateLesson);
    router.delete('/:id', lessonController.deleteLesson);

    app.use("/api/lessons", router);
};
