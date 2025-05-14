module.exports = (app) => {
  var router = require('express').Router();
  const finalExamQuestionController = require('../controllers/finalExamQuestion.controller'); // Path to your controller file

  // Create a new finalExamQuestionuration
  router.post('/', finalExamQuestionController.createFinalExamQuestion);

  // Get all finalExamQuestionurations
  router.get('/', finalExamQuestionController.getFinalExamQuestions);

  router.get('/:lessonId', finalExamQuestionController.getAllFinalExamQuestions);

  // Get a specific finalExamQuestionuration by item_code
  router.get('/:id', finalExamQuestionController.getFinalExamQuestionByItemCode);

  // Update a finalExamQuestionuration
  router.put('/:id', finalExamQuestionController.updateFinalExamQuestion);

  // Delete a finalExamQuestionuration
  router.delete('/:id/:item_code', finalExamQuestionController.deleteFinalExamQuestion);

  app.use('/api/finalExamQuestion', router);
};
