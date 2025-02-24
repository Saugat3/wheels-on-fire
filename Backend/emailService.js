const nodemailer = require('nodemailer');

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'talktosaugat@gmail.com',
    pass: 'ctqm yudj qceg mvtc',
  },
});

// Function to send a verification email with a code
const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: 'talktosaugat@gmail.com',
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

// Function to send a welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const mailOptions = {
    from: 'talktosaugat@gmail.com',
    to: email,
    subject: 'Welcome to Wheels On Fire',
    html: `
    <div style="text-align: center; background-color: #1c1921; padding: 30px; border-radius: 20px; color: #FFFFFF; font-family: 'Gabriel Sans', sans-serif;">
      <img src="https://i.ibb.co/46wV38W/logo.png" alt="Wheels on Fire Logo" style="width: 150px; height: auto; border-radius: 10px; box-shadow: 0 1px 5px #0DBF2A;" />
      
      <h1 style="color: #0DBF2A; margin-top: 40px;">Welcome, ${firstName}!</h1>
      
      <p style="font-size: 16px; margin: 10px 0;">
          Thank you for joining <strong>Wheels on Fire</strong>—where your ride gets the care it deserves!
      </p>

      <p style="font-size: 16px; margin: 10px 0;">
          Explore our platform to book top-notch services and meet expert mechanics ready to bring your machine to life.
      </p>

      <p style="font-size: 14px; margin-top: 20px;">
          🔥 Ride Safe, Stay Awesome! <br><strong>The Wheels on Fire Team</strong>
      </p>
    </div>

    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = { sendVerificationCode, sendWelcomeEmail };