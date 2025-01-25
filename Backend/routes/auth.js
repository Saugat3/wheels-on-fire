// File: backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(400).send({ error: 'Error registering user', details: error });
    }
  });
  
  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).send({ error: 'Error during login', details: error });
    }
  });
  
  module.exports = router;