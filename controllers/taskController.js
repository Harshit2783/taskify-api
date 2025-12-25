const Task = require('../models/Task')

const getTasks = async (req, res)=>{
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
};

const createTask = async (req, res)=>{
    try{
        const task =await Task.create(req.body)
        res.status(201).json(task)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const updateTask = async (req, res)=>{
    try{
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new: true})
        res.status(200).json(task)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const deleteTask = async (req, res)=>{
    try{
        await Task.findByIdAndDelete(req.params.id)
        res.status(200).send("Task deleted successfully")
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}
module.exports = { getTasks, createTask, updateTask, deleteTask }