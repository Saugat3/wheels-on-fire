const express = require('express');
const { getAllUsers, getUserById } = require('../controller/userController');
const { jwtAuthMiddleware } = require("../jwt");


const router = express.Router();

// Route to get all users
router.get('/users', getAllUsers);

// Route to get a single user by ID
router.get('/users/:userId',jwtAuthMiddleware, getUserById);

module.exports = router;
