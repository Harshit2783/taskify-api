const express = require('express')
const {register, login} = require('../controllers/authController')

const router = express.Router()

router.post('/register', register) // For register a user.
router.post('/login', login) // For logging in a user.

module.exports = router