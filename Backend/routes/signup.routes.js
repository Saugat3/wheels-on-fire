const express = require('express');
const { createUserValidator } = require('../validator/signup.validator');
const { createUser } = require('../controller/signup.controller');

const router = express.Router();


router.post('/signup', createUserValidator, createUser);

module.exports = router;