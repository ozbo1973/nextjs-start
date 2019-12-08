const mongoose = require("mongoose");

const xxxSchema = new mongoose.Schema({
  title: String
});

module.exports = mongoose.model("Name", xxxSchema);
