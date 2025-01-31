const express = require('express');
const signupRoutes = require('./signup.routes');
const loginRoutes = require('./login.routes');
const userRoutes = require('../routes/userRoutes');
const mechanicRoutes = require('../routes/mechanic.routes'); // Adjust path as needed
const appointmentRoutes = require('../routes/appointmentRoutes');



const router = express.Router();

router.use(signupRoutes);
router.use(loginRoutes);
router.use(userRoutes);
router.use(mechanicRoutes);
router.use(appointmentRoutes);


module.exports = router;