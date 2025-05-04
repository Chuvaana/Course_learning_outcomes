module.exports = (app) => {
  const scheduleController = require('../controllers/scheduleSem.controller');
  var router = require('express').Router();

  router.get('/:id', scheduleController.getSchedules);
  router.post('/', scheduleController.createSchedules);
  router.post('/sem/', scheduleController.createSchedulesSem);
  router.put('/:id', scheduleController.updateSchedule);

  app.use('/api/scheduleSems', router);
};
