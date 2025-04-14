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

// Function to send a cancellation email
const sendCancellationEmail = async (email, firstName, appointmentDetails) => {
  const mailOptions = {
    from: 'talktosaugat@gmail.com',
    to: email,
    subject: 'Your Appointment Has Been Cancelled',
    html: `
    <div style="text-align: center; background-color: #1c1921; padding: 30px; border-radius: 20px; color: #FFFFFF; font-family: 'Gabriel Sans', sans-serif;">
      <img src="https://i.ibb.co/46wV38W/logo.png" alt="Wheels on Fire Logo" style="width: 150px; height: auto; border-radius: 10px; box-shadow: 0 1px 5px #0DBF2A;" />
      
      <h1 style="color: #dc3545; margin-top: 40px;">Appointment Cancelled</h1>
      
      <p style="font-size: 16px; margin: 10px 0;">
          Dear ${firstName}, we're sorry to inform you that your appointment has been cancelled.
      </p>

      <div style="background-color: rgba(220, 53, 69, 0.1); border-radius: 10px; padding: 15px; margin: 20px 0; text-align: left;">
        <h3 style="color: #dc3545; margin-top: 0;">Appointment Details</h3>
        <p><strong>Service:</strong> ${appointmentDetails.serviceName}</p>
        <p><strong>Date:</strong> ${new Date(appointmentDetails.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointmentDetails.appointmentTime}</p>
        <p><strong>Vehicle:</strong> ${appointmentDetails.vehicleCompany} ${appointmentDetails.vehicleModel}</p>
      </div>

      <p style="font-size: 16px;">
          Please contact us if you have any questions or would like to reschedule.
      </p>

      <p style="font-size: 14px; margin-top: 20px;">
          🔥 Ride Safe, Stay Awesome! <br><strong>The Wheels on Fire Team</strong>
      </p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent successfully');
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

// Add to emailService.js
const sendCustomEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: 'talktosaugat@gmail.com',
    to,
    subject,
    html: `
    <div style="text-align: center; background-color: #1c1921; padding: 30px; border-radius: 20px; color: #FFFFFF; font-family: Arial, sans-serif;">
      <img src="https://i.ibb.co/46wV38W/logo.png" alt="Wheels on Fire Logo" 
           style="width: 150px; height: auto; border-radius: 10px; box-shadow: 0 1px 5px #0DBF2A;" /><br>
      ${htmlContent}
      <p style="font-size: 14px; margin-top: 30px; color: rgba(255,255,255,0.7);">
        This email was sent from Wheels on Fire administration.
      </p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

// Add to exports
module.exports = {
  sendVerificationCode,
  sendWelcomeEmail,
  sendCancellationEmail,
  sendCustomEmail
};