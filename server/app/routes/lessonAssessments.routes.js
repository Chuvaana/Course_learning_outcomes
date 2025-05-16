module.exports = (app) => {
  const controller = require('../controllers/lessonAssessments.controller.js');

  var router = require('express').Router();

  // Create new AssessFooter
  router.post('/', controller.createAssessment);

  // Create new AssessFooter
  router.get('/', controller.getAllAssessments);

  router.get('/:lessonId', controller.getAllLessonAssments);

  router.get('/type/:lessonId', controller.getAllLessonAssmentsByType);

  router.get('/student/:lessonId', controller.getAllLessonAssmentsByStudent);

  // Create new AssessFooter
  router.get('/:id', controller.getAssessmentById);

  // Create new AssessFooter
  router.put('/:id', controller.updateAssessment);

  // Create new AssessFooter
  router.delete('/:id', controller.deleteAssessment);

  app.use('/api/lessonassessments', router);
};
