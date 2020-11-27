var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    start: Date,
    end: Date,
    background: String,
    icon: String,
    assignedto: String,
    assignedby: String
});

module.exports = mongoose.model("Task", taskSchema);