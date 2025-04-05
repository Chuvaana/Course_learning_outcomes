module.exports = (app) => {
  const assessController = require('../controllers/assessFooter.controller');
  var router = require('express').Router();

  // Create new AssessFooter
  router.post('/', assessController.createAssessFooter);

  // Get all AssessFooters
  router.get('/', assessController.getAllAssessFooters);

  // Get AssessFooter by lessonId
  router.get('/:lessonId', assessController.getAssessFooterByLessonId);

  // Update an AssessFooter by ID
  router.put('/:id', assessController.updateAssessFooter);

  // Delete an AssessFooter by ID
  router.delete('/:id', assessController.deleteAssessFooter);

  app.use('/api/assessFooters', router);
};
