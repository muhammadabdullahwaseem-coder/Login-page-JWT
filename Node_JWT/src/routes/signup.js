
const express = require('express');
const signupController = require('../controller/signup');

const router = express.Router();

router.post('/register', signupController.crateUser);


module.exports = router;
