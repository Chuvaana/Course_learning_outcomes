module.exports = app => {
    var router = require("express").Router();
    const verbController = require('../controllers/verb.controller'); // Path to your controller file

    // Create a new verburation
    router.post('/', verbController.createVerb);

    // Get all verburations
    router.get('/', verbController.getVerbs);

    // Get a specific verburation by item_code
    router.get('/:id', verbController.getVerbByItemCode);

    // Update a verburation
    router.put('/:id', verbController.updateVerb);

    // Delete a verburation
    router.delete('/:item_code', verbController.deleteVerb);

    app.use("/api/verb", router);
};