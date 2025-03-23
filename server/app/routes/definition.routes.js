module.exports = app => {
    const definitionController = require('../controllers/definition.controller');
    var router = require("express").Router();

    router.post('/', definitionController.createDefinition);
    router.get('/', definitionController.getAllDefinitions);
    router.get('/:id', definitionController.getDefinitionById);
    router.put('/:id', definitionController.updateDefinition);

    app.use("/api/definitions", router);
};
