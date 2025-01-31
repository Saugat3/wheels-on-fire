const mongoose = require('mongoose');

// Define the Appointment Schema
const appointmentSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },  // Add service name
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
    default: 'Pending' // Default status is 'Pending'
  }
}, { timestamps: true });

// Create the model from the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
