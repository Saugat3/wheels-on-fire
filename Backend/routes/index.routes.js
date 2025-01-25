const express = require('express');
const signupRoutes = require('./signup.routes');
const loginRoutes = require('./login.routes');


const router = express.Router();

router.use(signupRoutes);
router.use(loginRoutes);

module.exports = router;