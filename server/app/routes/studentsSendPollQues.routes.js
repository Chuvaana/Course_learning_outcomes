module.exports = app => {
    const controller = require('../controllers/StudentsSendPollQues.controller.js');
    
    var router = require('express').Router();

    router.post('/', controller.createStudentsSendPollQues);

    router.get('/', controller.getAllStudentsSendPollQuess);

    router.get('/:lessonId', controller.getAllLessonStudentsSendPollQues);

    router.get('/:studentId', controller.getAllStudentsSendPollQues);

    router.get('/:id', controller.getStudentsSendPollQuesById);

    router.put('/:id', controller.updateStudentsSendPollQues);

    router.delete('/:id', controller.deleteStudentsSendPollQues);

    app.use('/api/StudentsSendPollQues', router);
};
