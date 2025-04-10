const mongoose = require('mongoose');

const subMethodSchema = new mongoose.Schema({
  subMethod: { type: String, required: true },
  point: { type: Number, required: true },
});

module.exports = mongoose.model('SubMethod', subMethodSchema);
