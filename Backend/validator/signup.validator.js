const { checkSchema, validationResult } = require('express-validator');
const User = require('../models/user.model');

// Define validation schema
const userSchema = checkSchema({
  firstName: {
    notEmpty: { errorMessage: 'First name is required' },
  },
  lastName: {
    notEmpty: { errorMessage: 'Last name is required' },
  },
  email: {
    notEmpty: { errorMessage: 'Email is required' },
    isEmail: { errorMessage: 'Invalid email address' },
  },
  phoneNumber: {
    notEmpty: { errorMessage: 'Phone number is required' },
    matches: {
      options: [/^\d{10}$/],
      errorMessage: 'Phone number must be 10 digits',
    },
  },
  address: {
    notEmpty: { errorMessage: 'Address is required' },
    custom: {
      options: (value) => /(Kathmandu|Lalitpur|Bhaktapur)$/i.test(value),
      errorMessage: 'Address must end with one of the districts: Kathmandu, Lalitpur, Bhaktapur',
    },
  },
  password: {
    notEmpty: { errorMessage: 'Password is required' },
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
  },
  confirmPassword: {
    notEmpty: { errorMessage: 'Confirm password is required' },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: 'Confirm password must match the password',
    },
  },
});

// Validation middleware
exports.createUserValidator = [
  userSchema,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { email, phoneNumber } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ error: 'Phone number is already in use' });
      }
    }

    next();
  },
];