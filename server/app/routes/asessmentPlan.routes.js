module.exports = (app) => {
  const assessmentPlanController = require('../controllers/assessmentPlan.controller');
  var router = require('express').Router();

  router.post('/', assessmentPlanController.createPlan);
  router.get('/:id', assessmentPlanController.getPlansByLesson);
  router.put('/:id', assessmentPlanController.updatePlansByLesson);

  app.use('/api/assessmentPlan', router);
};
