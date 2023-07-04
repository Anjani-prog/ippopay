const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Program1", "Program2"],
  },
  input: String,
  output: String,
});

module.exports = mongoose.model("Program", programSchema);
