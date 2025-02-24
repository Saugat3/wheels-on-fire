const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Appointment Schema
const appointmentSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  vehicleCompany: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleYear: { type: Number, required: true },
  vehicleNumber: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  mechanic: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userDetails: {  // Store user details
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;