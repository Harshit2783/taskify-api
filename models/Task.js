const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
{
    title: {type:String, required:true},
    description: String,
    completed: {type:Boolean, default: false},
    user: {type:mongoose.Schema.Types.ObjectId, ref: "User", required: true}  // I added this field later for stage 6.
},
{ // We wrote this separately cuz timestamps is not a field — it’s a schema option.
    timestamps: true    // This automatically adds createdAt and updatedAt fields.
});

module.exports = mongoose.model('Task', taskSchema)