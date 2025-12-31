const express = require('express')
const {registerUser, loginUser} = require('../controllers/authController')

const router = express.Router()

router.post('/register', registerUser) // For registering a user.
router.post('/login', loginUser) // For logging in a user.

module.exports = router