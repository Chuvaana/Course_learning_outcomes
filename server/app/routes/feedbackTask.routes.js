module.exports = (app) => {
  const feedbackTaskController = require('../controllers/feedbackTask.controller');
  var router = require('express').Router();

  router.post('/', feedbackTaskController.createTask);
  router.get('/:id', feedbackTaskController.getTasks);
  router.put('/:id', feedbackTaskController.updateTask);
  router.delete('/:id', feedbackTaskController.deleteTask);

  app.use('/api/feedbackTask', router);
};
