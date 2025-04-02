const Config = require('../models/config.model');  // Path to your model file

// Create a new configuration entry
exports.createConfig = async (req, res) => {
    try {
        const { branchId, department, name, itemCode, itemValue } = req.body;

        const newConfig = new Config({
            branchId,
            department,
            name,
            itemCode,
            itemValue,
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
    const id = req.params.id;
    try {
        const config = await Config.findOne({ itemCode: id });
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
const mongoose = require("mongoose");

exports.updateConfig = async (req, res) => {
    const id = req.params.id;
    const { branchId, department, name, itemCode, itemValue } = req.body;

    try {
        // Convert id to ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        const updatedConfig = await Config.findOneAndUpdate(
            { _id: objectId },  // Use an object for the filter
            { branchId, department, name, itemCode, itemValue },
            { new: true, runValidators: true }
        );

        if (!updatedConfig) {
            return res.status(404).json({ message: "Configuration not found" });
        }
        
        res.status(200).json({ message: "Configuration updated successfully", updatedConfig });
    } catch (error) {
        console.error("Error updating configuration:", error);
        res.status(500).json({ message: "Error updating configuration", error });
    }
};


// Delete a configuration entry
exports.deleteConfig = async (req, res) => {
    const { itemCode } = req.params;
    try {
        const deletedConfig = await Config.findOneAndDelete({ itemCode });

        if (!deletedConfig) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        res.status(200).json({ message: 'Configuration deleted successfully', deletedConfig });
    } catch (error) {
        console.error('Error deleting configuration:', error);
        res.status(500).json({ message: 'Error deleting configuration', error });
    }
};