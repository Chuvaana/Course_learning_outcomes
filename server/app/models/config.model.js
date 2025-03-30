const mongoose = require('mongoose');

// Define the schema for the configuration table
const configSchema = new mongoose.Schema({
  branch_id: { type: String, required: true },
  department: { type: String, required: true },
  item_code: { type: String, required: true, unique: true },  // item_code should be unique
  item_value: { type: String, required: true },
});

// Create the model from the schema
const Config = mongoose.model('Config', configSchema);

module.exports = Config;
