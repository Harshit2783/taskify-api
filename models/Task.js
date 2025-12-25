const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
{
    title: {type:String, required:true},
    description: String,
    completed: {type:Boolean, default: false}
},
{ // We wrote this separately cuz timestamps is not a field — it’s a schema option.
    timestamps: true    // This automatically adds createdAt and updatedAt fields.
});

module.exports = mongoose.model('Task', taskSchema)