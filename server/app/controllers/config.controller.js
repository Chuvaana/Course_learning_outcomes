const Config = require('../models/config.model');  // Path to your model file

// Create a new configuration entry
exports.createConfig = async (req, res) => {
    try {
        const { branch_id, department, item_code, item_value } = req.body;

        const newConfig = new Config({
            branch_id,
            department,
            item_code,
            item_value,
        });

        await newConfig.save();
        res.status(201).json({ message: 'Configuration created successfully', newConfig });
    } catch (error) {
        console.error('Error creating configuration:', error);
        res.status(500).json({ message: 'Error creating configuration', error });
    }
};

// Get all configuration entries
exports.getConfigs = async (req, res) => {
    try {
        const configs = await Config.find();
        res.status(200).json(configs);
    } catch (error) {
        console.error('Error fetching configurations:', error);
        res.status(500).json({ message: 'Error fetching configurations', error });
    }
};

// Get a specific configuration by item_code
exports.getConfigByItemCode = async (req, res) => {
    const { item_code } = req.params;
    try {
        const config = await Config.findOne({ item_code });
        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        res.status(200).json(config);
    } catch (error) {
        console.error('Error fetching configuration:', error);
        res.status(500).json({ message: 'Error fetching configuration', error });
    }
};

// Update an existing configuration
exports.updateConfig = async (req, res) => {
    const { item_code } = req.params;
    const { branch_id, department, item_value } = req.body;
    try {
        const updatedConfig = await Config.findOneAndUpdate(
            { item_code },
            { branch_id, department, item_value },
            { new: true } // Return the updated document
        );

        if (!updatedConfig) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        res.status(200).json({ message: 'Configuration updated successfully', updatedConfig });
    } catch (error) {
        console.error('Error updating configuration:', error);
        res.status(500).json({ message: 'Error updating configuration', error });
    }
};

// Delete a configuration entry
exports.deleteConfig = async (req, res) => {
    const { item_code } = req.params;
    try {
        const deletedConfig = await Config.findOneAndDelete({ item_code });

        if (!deletedConfig) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        res.status(200).json({ message: 'Configuration deleted successfully', deletedConfig });
    } catch (error) {
        console.error('Error deleting configuration:', error);
        res.status(500).json({ message: 'Error deleting configuration', error });
    }
};