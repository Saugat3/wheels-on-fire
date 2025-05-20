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

router.get('/api/mechanics/availability', async (req, res) => {
  try {
      const { date, mechanicName } = req.query;
      
      // Get all appointments for this mechanic on this date
      const appointments = await Appointment.find({
          mechanic: mechanicName, // Now storing mechanic name directly
          appointmentDate: new Date(date),
          status: { $ne: 'Cancelled' }
      });
      
      const bookedSlots = appointments.map(a => a.appointmentTime);
      res.json({ bookedSlots });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
