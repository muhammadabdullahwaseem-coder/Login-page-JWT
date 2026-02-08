const express = require('express');
const signupController = require('../controller/signup');

const router = express.Router();

router.post('/register', signupController.createUser); 

module.exports = router;