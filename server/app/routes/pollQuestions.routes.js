module.exports = app => {
    const controller = require('../controllers/PollQuestions.controller.js');
    
    var router = require('express').Router();

    router.post('/', controller.createPollQuestions);

    router.get('/', controller.getAllPollQuestionss);

    router.get('/:lessonId', controller.getAllPollQuestions);

    router.get('/:id', controller.getPollQuestionsById);

    router.put('/:id', controller.updatePollQuestions);

    router.delete('/:id', controller.deletePollQuestions);

    app.use('/api/PollQuestions', router);
};
