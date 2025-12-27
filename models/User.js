const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase: true}, // "lowercase: true" automatically converts input to lowercase.
    password: {type: String, required: true} 
},
{   timestamps:true}
);

module.exports = mongoose.model('User', userSchema)