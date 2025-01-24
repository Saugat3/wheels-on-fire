// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));