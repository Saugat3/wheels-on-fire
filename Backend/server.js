// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index.routes'); // Importing index routes
const app = express();
const dotenv = require('dotenv');

// Middleware
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api', routes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));