module.exports = app => {
    var router = require("express").Router();
    const finalExamController = require('../controllers/finalExam.controller'); // Path to your controller file

    // Create a new finalExamuration
    router.post('/', finalExamController.createFinalExam);

    // Get all finalExamurations
    router.get('/', finalExamController.getFinalExams);

    router.get('/:lessonId', finalExamController.getAllFinalExamQuestions);

    // Get a specific finalExamuration by item_code
    router.get('/:id', finalExamController.getFinalExamByItemCode);

    // Update a finalExamuration
    router.put('/:id', finalExamController.updateFinalExam);

    // Delete a finalExamuration
    router.delete('/:item_code', finalExamController.deleteFinalExam);

    app.use("/api/finalExam", router);
};