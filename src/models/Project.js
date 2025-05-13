const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  link: String,
  image: String,
  technologies: [String],
  date: { type: Date, default: Date.now },
  description: String,
});

module.exports = mongoose.model("Project", projectSchema);
