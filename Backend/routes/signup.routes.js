const express = require('express');
const { createUserValidator } = require('../validator/signup.validator');
const { createUser, verifyCode } = require('../controller/signup.controller');

const router = express.Router();


router.post('/signup', createUserValidator, createUser);

router.post('/verify-code', verifyCode); 

module.exports = router;