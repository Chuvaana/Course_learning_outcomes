module.exports = (app) => {
  const feedBackController = require('../controllers/lessonFeedback.controller');
  var router = require('express').Router();
  router.post('/', feedBackController.createFeedback);
  router.get('/:id', feedBackController.getFeedbackByLesson);
  router.put('/:id', feedBackController.updateFeedback);

  app.use('/api/feedBack', router);
};
