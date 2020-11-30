var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    events:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }
    ]
});

module.exports = mongoose.model("Event", eventSchema);