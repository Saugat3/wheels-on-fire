const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateStatus,
} = require('../controller/appointmentController');

// Create a new appointment
router.post('/appointments/add', createAppointment);

// Get all appointments
router.get('/appointments', getAllAppointments);

// Get a specific appointment by ID
router.get('/appointments/:id', getAppointmentById);

// Update appointment details
router.put('/appointments/:id', updateAppointment);

// Delete an appointment
router.delete('/appointments/:id', deleteAppointment);

// Update appointment status (for dropdown actions)
router.put('/appointments/:id/status', updateStatus);

module.exports = router;
