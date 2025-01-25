const bcrypt = require('bcrypt'); // Importing Bcrypt Library
const User = require('../models/user.model');
const { generateToken } = require('../jwt'); // Import the JWT file forgenerating token

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // User doesn't exist
      return res.status(404).json({ error: 'Email does not exist' });
    }

    // Verify password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      // Password does not match
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      firstName : user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
      role: user.role,
    });

    // Successful login
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName : user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};