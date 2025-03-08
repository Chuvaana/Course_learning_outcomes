const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.teacher = require("./teacher.model.js")(mongoose);

db.branch = {};
db.branch.mongoose = mongoose;
db.branch.url = dbConfig.url;
db.branch.branches = require("./branch.model.js")(mongoose);

module.exports = db;
