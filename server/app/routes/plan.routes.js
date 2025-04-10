module.exports = (app) => {
  var router = require('express').Router();
  const methodController = require('../controllers/plan.controller');

  // Route to save assessment plan
  router.post('/', methodController.saveAssessmentPlan);

  // Route to get methods by lessonId
  router.get('/:lessonId', methodController.getListByLessonId);

  // Route to update an assessment plan (method and subMethods)
  router.put('/:lessonId', methodController.updateAssessmentPlan);

  // Route to delete an assessment plan (method and subMethods)
  router.delete('/:methodId', methodController.deleteAssessmentPlan);

  app.use('/api/assessment-plan', router);
};
