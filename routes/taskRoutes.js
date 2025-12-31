const express = require('express')
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController') // See ./ vs ../ vs ../../ below at last.
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getTasks)

router.post('/', authMiddleware, createTask)

router.put('/:id', authMiddleware, updateTask)

router.delete('/:id', authMiddleware, deleteTask)

module.exports = router

/*
QUICK MENTAL RULE
./ -> same folder as the current file.
../ -> go up one one folder.
../../ -> go up two folders.

Ex: We are in "taskRoutes.js" file in "Routes" folder so if we use './' that means we are looking in the same folder i.e. "Routes" 
folder. But "taskController.js" is one folder up i.e. in "controllers" folder so we need to use '../' and that' what we are doing 
in this file. 
*/