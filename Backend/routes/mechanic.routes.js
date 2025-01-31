const express = require('express');
const router = express.Router();
const upload = require('../multer'); // Adjust path as needed
const { addMechanic, getMechanics, getMechanicById, updateMechanic, deleteMechanic } = require('../controller/mechanic.controller');

// Route to add a new mechanic (including photo upload)
router.post('/mechanics/add', upload.single('photo'), addMechanic);

// Route to get all mechanics
router.get('/mechanics', getMechanics);

// Route to get a single mechanic by ID
router.get('/mechanics/:id', getMechanicById);

// Route to update a mechanic's details
router.put('/mechanics/:id', upload.single('photo'), updateMechanic);

// Route to delete a mechanic
router.delete('/mechanics/:id', deleteMechanic);

module.exports = router;
