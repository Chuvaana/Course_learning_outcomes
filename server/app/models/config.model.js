const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  branchId: { type: String, required: true },
  department: { type: String, required: true },
  name: { type: String, required: true },
  itemCode: { type: String, required: true },
  itemValue: { type: String, required: true },
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
