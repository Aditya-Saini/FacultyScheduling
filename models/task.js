var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    start: Date,
    end: Date,
    background: String,
    icon: String,
    confirmation: {
        type: Boolean,
        default: false
    },
    assignedto: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assignedby: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Task", taskSchema);