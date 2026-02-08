const express = require('express');
const signupController = require('../controller/signup');

const router = express.Router();

// This handles POST requests to /register
router.post('/register', signupController.createUser); 

module.exports = router;