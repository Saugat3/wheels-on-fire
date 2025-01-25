const User = require('../models/user.model');

// Controller to fetch all users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); // Retrieve all users from the database
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
 // Controller to fetch user details by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // // Ensure the requesting user can only access their own details (or apply role-based checks)
        // if (req.user._id !== userId && req.user.role !== "user") {
        //     return res.status(403).json({ message: "Access denied." });
        // }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error." });
    }
};

  module.exports = { getAllUsers, getUserById };
