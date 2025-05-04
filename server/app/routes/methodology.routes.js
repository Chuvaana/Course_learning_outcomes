module.exports = (app) => {
  const methodologyController = require('../controllers/methodology.controller');
  var router = require('express').Router();

  router.get('/', methodologyController.getMethodologies);
  router.get('/:id', methodologyController.getMethodologyById);
  router.post('/', methodologyController.createMethodology);
  router.post('/all/', methodologyController.createMethodologies);
  router.put('/:id', methodologyController.updateMethodology);
  router.delete('/:id', methodologyController.deleteMethodology);

  app.use('/api/methodologys', router);
};
