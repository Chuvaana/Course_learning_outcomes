module.exports = (app) => {
  const scheduleController = require('../controllers/scheduleLab.controller');
  var router = require('express').Router();

  router.get('/:id', scheduleController.getSchedules);
  router.post('/', scheduleController.createSchedules);
  router.post('/lab/', scheduleController.createSchedulesLab);
  router.put('/:id', scheduleController.updateSchedule);

  app.use('/api/scheduleLabs', router);
};
