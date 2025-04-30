module.exports = app => {
    var router = require("express").Router();
    const ploController = require('../controllers/plo.controller'); // Path to your controller file

    // Create a new plouration
    router.post('/', ploController.createPlo);

    // Get all plourations
    router.get('/', ploController.getPlos);

    // Get a specific plouration by item_code
    router.get('/:id', ploController.getPloByItemCode);

    // Update a Plouration
    router.put('/:id', ploController.updatePlo);

    // Delete a plouration
    router.delete('/:item_code', ploController.deletePlo);

    app.use("/api/plo", router);
};