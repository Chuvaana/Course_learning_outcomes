const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.teacher = require("./teacher.model.js")(mongoose);

module.exports = db;

const branch = {};
branch.mongoose = mongoose;
branch.url = dbConfig.url;
branch.branches = require("./branch.model.js")(mongoose);

module.exports = branch;
