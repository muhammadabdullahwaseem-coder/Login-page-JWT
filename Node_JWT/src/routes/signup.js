const express = require('express');
const signupController = require('../controller/signup');

const router = express.Router();

// 👇 This matches the function name 'createUser' we defined above
router.post('/register', signupController.createUser); 

module.exports = router;