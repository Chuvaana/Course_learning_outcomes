module.exports = (app) => {
  const router = require('express').Router();
  const activityController = require('../controllers/activity.controller');

  // 📌 Create a new activity record
  router.post('/', activityController.createActivity);
  router.post('/all', activityController.createActivityAll);

  // 📌 Get activity records by lessonId, weekNumber, and type
  router.get('/', activityController.getActivityByFilter);

  router.get('/:id', activityController.getActivityByLesson);

  // 📌 Update an activity record
  router.put('/:id', activityController.updateActivity);

  // 📌 Delete an activity record
  router.delete('/:id', activityController.deleteActivity);

  app.use('/api/activity', router);
};
