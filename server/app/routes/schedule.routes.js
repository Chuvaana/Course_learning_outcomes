module.exports = (app) => {
  const scheduleController = require('../controllers/schedule.controller');
  var router = require('express').Router();

  router.get('/:id', scheduleController.getSchedules);
  router.post('/', scheduleController.createSchedules);
  router.post('/lec', scheduleController.createSchedulesLec);
  router.put('/:id', scheduleController.updateSchedule);

  app.use('/api/schedules', router);
};
