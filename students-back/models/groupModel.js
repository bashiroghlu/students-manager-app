const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  students: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
