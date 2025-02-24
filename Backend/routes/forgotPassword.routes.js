const express = require('express');
const { forgotPassword, verifyResetCode } = require('../controller/forgotPassword.controller');

const router = express.Router();


router.post('/forgot-password', forgotPassword);

router.post('/verify-reset-code', verifyResetCode);

module.exports = router;