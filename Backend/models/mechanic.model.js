const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mechanicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    photo: {
        type: String, // This will store the file path of the uploaded image
        required: true
    },
    experience: {
        type: Number, // Number of years
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Mechanic', mechanicSchema);
