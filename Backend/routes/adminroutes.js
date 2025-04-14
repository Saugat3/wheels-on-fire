const express = require('express');
const router = express.Router();
const { sendCustomEmail } = require('../emailService');

router.post('/send-email', async (req, res) => {
    try {
      const { to, subject, content } = req.body;
      const result = await sendCustomEmail(to, subject, content);
      
      // Always return JSON
      if (result.success) {
        res.status(200).json({ message: 'Email sent successfully' });
      } else {
        res.status(500).json({ message: result.message });
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Error sending email',
        error: error.message 
      });
    }
  });
module.exports = router;