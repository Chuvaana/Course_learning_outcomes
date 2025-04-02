module.exports = app => {
    var router = require("express").Router();
    const configController = require('../controllers/config.controller'); // Path to your controller file

    // Create a new configuration
    router.post('/', configController.createConfig);

    // Get all configurations
    router.get('/', configController.getConfigs);

    // Get a specific configuration by item_code
    router.get('/:id', configController.getConfigByItemCode);

    // Update a configuration
    router.put('/:id', configController.updateConfig);

    // Delete a configuration
    router.delete('/:item_code', configController.deleteConfig);

    app.use("/api/config", router);
};