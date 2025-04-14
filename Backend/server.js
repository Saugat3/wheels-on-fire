// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index.routes'); // Importing index routes
const app = express();
const dotenv = require('dotenv');
const path = require('path');

// Middleware
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api', routes);
// Serve static frontend (e.g., index.html)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Fallback route to serve index.html on unknown paths (like '/')
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));