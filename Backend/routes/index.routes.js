const express = require('express');
const signupRoutes = require('./signup.routes');
const loginRoutes = require('./login.routes');
const userRoutes = require('../routes/userRoutes');


const router = express.Router();

router.use(signupRoutes);
router.use(loginRoutes);
router.use(userRoutes);

module.exports = router;