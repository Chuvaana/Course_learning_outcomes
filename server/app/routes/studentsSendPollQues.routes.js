module.exports = (app) => {
  const controller = require('../controllers/studentsSendPollQues.controller');

  var router = require('express').Router();

  router.post('/', controller.createStudentsSendPollQues);

  router.get('/', controller.getAllStudentsSendPollQuess);

  router.get('/lesson/:lessonId', controller.getAllLessonStudentsSendPollQues);

  router.get('/lessonClo/:lessonId', controller.getPollQuesLessonClo);

  router.get('/:studentId', controller.getAllStudentsSendPollQues);

  router.get('/:id', controller.getStudentsSendPollQuesById);

  router.put('/:id', controller.updateStudentsSendPollQues);

  router.delete('/:id', controller.deleteStudentsSendPollQues);

  app.use('/api/studentsSendPollQues', router);
};
