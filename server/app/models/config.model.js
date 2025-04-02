const mongoose = require('mongoose');

// Define the schema for the configuration table
const configSchema = new mongoose.Schema({
  branchId: { type: String, required: true },
  department: { type: String, required: true },
  name: { type: String, required: true },
  itemCode: { type: String, required: true },  // item_code should be unique
  itemValue: { type: String, required: true },
});

// Create the model from the schema
const Config = mongoose.model('Config', configSchema);

module.exports = Config;
