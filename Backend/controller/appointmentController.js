const Appointment = require('../models/appointmentModel');
const { sendCancellationEmail } = require('../emailService');
const User = require('../models/user.model'); // Import User model

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { userId, serviceName, vehicleCompany, vehicleModel, vehicleYear, vehicleNumber, appointmentDate, appointmentTime, mechanic } = req.body;
    
    // Check if required data is present
    if (!userId || !serviceName || !vehicleCompany || !vehicleModel || !vehicleYear || !vehicleNumber || !appointmentDate || !appointmentTime || !mechanic) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Fetch user details by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new appointment and save user details
    const newAppointment = new Appointment({
      serviceName,
      vehicleCompany,
      vehicleModel,
      vehicleYear,
      vehicleNumber,
      appointmentDate,
      appointmentTime,
      mechanic,
      user: userId,  // Store user ID
      userDetails: {  // Store user details
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment scheduled successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'firstName lastName phoneNumber email') // Populate user details
      .populate('mechanic');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id)
      .populate('user', 'firstName lastName phoneNumber email')
      .populate('mechanic');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointment', error: error.message });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { vehicleCompany, vehicleModel, vehicleYear, vehicleNumber, appointmentDate, appointmentTime, mechanic } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
      vehicleCompany,
      vehicleModel,
      vehicleYear,
      vehicleNumber,
      appointmentDate,
      appointmentTime,
      mechanic,
    }, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully!', updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};

// Update the status of an appointment

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('user', 'firstName email');

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send cancellation email if status changed to Cancelled
    if (status === 'Cancelled') {
      await sendCancellationEmail(
        updatedAppointment.user.email,
        updatedAppointment.user.firstName,
        {
          serviceName: updatedAppointment.serviceName,
          appointmentDate: updatedAppointment.appointmentDate,
          appointmentTime: updatedAppointment.appointmentTime,
          vehicleCompany: updatedAppointment.vehicleCompany,
          vehicleModel: updatedAppointment.vehicleModel
        }
      );
    }

    res.status(200).json({ 
      message: 'Appointment status updated', 
      updatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating appointment status', 
      error: error.message 
    });
  }
};


module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateStatus,
};