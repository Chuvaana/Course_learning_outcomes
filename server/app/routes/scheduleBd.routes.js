module.exports = app => {
    const scheduleController = require('../controllers/scheduleBd.controller');
    var router = require("express").Router();

    router.get('/:id', scheduleController.getSchedules);
    router.post('/', scheduleController.createSchedules);
    router.put('/:id', scheduleController.updateSchedule);

    app.use("/api/scheduleBds", router);
};
