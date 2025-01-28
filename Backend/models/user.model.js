const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Regular expression to check if the address ends with one of the districts
          return /(Kathmandu|Lalitpur|Bhaktapur)$/i.test(value);
        },
        message: 'Address must end with one of the districts: Kathmandu, Lalitpur, Bhaktapur',
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // Default role is user
    },
  },
  { collection: 'Users' }
);

module.exports = mongoose.model('User', userSchema);