const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index.routes');
const adminRoutes = require('./routes/adminroutes'); 
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
app.use('/api/admin', adminRoutes); // Add this line to mount admin routes

// Serve static frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));