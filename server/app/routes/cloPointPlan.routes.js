// routes/cloPlanRoutes.js

module.exports = (app) => {
  var router = require('express').Router();
  const cloPlanController = require('../controllers/cloPointPlan.controller');

  router.post('/', cloPlanController.saveCloPlans);

  // Get CLO plans by lessonId
  router.get('/:lessonId', cloPlanController.getCloPlansByLessonId);

  // Update single CLO plan by _id
  router.post('/edit', cloPlanController.updateCloPlan);

  // Delete single CLO plan by _id
  router.delete('/:id', cloPlanController.deleteCloPlan);

  app.use('/api/clo-plans', router);
};
