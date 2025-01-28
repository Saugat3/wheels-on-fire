const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require('../controller/userController');

// GET all users
router.get('/users', getAllUsers);

// GET single user by ID
router.get('/users/:id', getUserById);

// DELETE a user by ID
router.delete('/users/:id', deleteUserById);

// UPDATE a user by ID
router.put('/users/:id', updateUserById);

module.exports = router;
