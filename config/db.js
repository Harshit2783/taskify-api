const mongoose = require('mongoose')

connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/taskify')
        console.log(`DB Connected Successfuly: ${conn.connection.host}`)
    }
    catch(error){
        console.log("DB Connection Failed:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB