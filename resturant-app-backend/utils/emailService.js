const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER || "ahmednabil3400@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "ahmed3400",
  },
  // Add additional security options for Gmail
  secure: true, // use TLS
  logger: true, // Enable logging
  debug: true, // Enable debug output
});

// Email templates
const generateReservationConfirmationEmail = (
  reservation,
  restaurantName = "Our Restaurant"
) => {
  const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `Reservation Confirmation - ${restaurantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Reservation Confirmation</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Your reservation has been confirmed!</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0;">${reservation.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Time:</td>
              <td style="padding: 8px 0;">${reservation.startTime} - ${
      reservation.endTime
    }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Party Size:</td>
              <td style="padding: 8px 0;">${reservation.partySize} people</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Table Number:</td>
              <td style="padding: 8px 0; color: #007bff; font-weight: bold;">${
                reservation.tableNumber
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Reservation ID:</td>
              <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${
                reservation.id
              }</td>
            </tr>
            ${
              reservation.specialRequests
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Special Requests:</td>
              <td style="padding: 8px 0;">${reservation.specialRequests}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #1976d2; margin-top: 0;">Important Information:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Please arrive 10 minutes before your reservation time</li>
            <li>If you need to cancel or modify your reservation, please contact us at least 2 hours in advance</li>
            <li>Your table will be held for 15 minutes past your reservation time</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 5px 0;">Thank you for choosing ${restaurantName}!</p>
          <p style="color: #666; margin: 5px 0;">We look forward to serving you.</p>
        </div>
      </div>
    `,
  };
};

const generateReservationPendingEmail = (
  reservation,
  restaurantName = "Our Restaurant",
  confirmationToken = null
) => {
  const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const baseUrl = process.env.BASE_URL || "http://localhost:8080";
  const confirmUrl = `${baseUrl}/api/reservations/confirm/${reservation.id}?token=${confirmationToken}`;
  const cancelUrl = `${baseUrl}/api/reservations/cancel/${reservation.id}?token=${confirmationToken}`;

  return {
    subject: `Please Confirm Your Reservation - ${restaurantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Please Confirm Your Reservation</h2>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <h3 style="color: #1565c0; margin-top: 0;">Action Required: Please confirm your reservation</h3>
          <p style="color: #1565c0; margin: 0;">Click the "Confirm Reservation" button below to finalize your booking.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Reservation Details:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0;">${reservation.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Time:</td>
              <td style="padding: 8px 0;">${reservation.startTime} - ${
      reservation.endTime
    }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Party Size:</td>
              <td style="padding: 8px 0;">${reservation.partySize} people</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Table Number:</td>
              <td style="padding: 8px 0; color: #007bff; font-weight: bold;">${
                reservation.tableNumber
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Reservation ID:</td>
              <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${
                reservation.id
              }</td>
            </tr>
            ${
              reservation.specialRequests
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Special Requests:</td>
              <td style="padding: 8px 0;">${reservation.specialRequests}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 10px;">✓ Confirm Reservation</a>
          <a href="${cancelUrl}" style="background-color: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 10px;">✗ Cancel Reservation</a>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #856404; margin-top: 0;">Important:</h4>
          <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li>Please confirm or cancel within 24 hours</li>
            <li>Unconfirmed reservations will be automatically cancelled</li>
            <li>You'll receive a final confirmation email once confirmed</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 5px 0;">Thank you for choosing ${restaurantName}!</p>
        </div>
      </div>
    `,
  };
};

// Send email function
const sendEmail = async (to, emailContent) => {
  try {
    // Verify transporter configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    const mailOptions = {
      from: process.env.EMAIL_USER || "ahmednabil3400@gmail.com",
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);

    // Provide more detailed error information
    if (error.code === "EAUTH") {
      console.error(
        "Authentication failed. Please check your email credentials."
      );
      console.error(
        "For Gmail, you may need to use an App Password instead of your regular password."
      );
    } else if (error.code === "ENOTFOUND") {
      console.error("Network error. Please check your internet connection.");
    }

    return { success: false, error: error.message };
  }
};

// Main functions to send reservation emails
const sendReservationPendingEmail = async (reservation, confirmationToken) => {
  const emailContent = generateReservationPendingEmail(
    reservation,
    "Our Restaurant",
    confirmationToken
  );
  return await sendEmail(reservation.email, emailContent);
};

const sendReservationConfirmationEmail = async (reservation) => {
  const emailContent = generateReservationConfirmationEmail(reservation);
  return await sendEmail(reservation.email, emailContent);
};

// Test email function for debugging
const testEmailConfiguration = async (testEmail = null) => {
  try {
    await transporter.verify();
    console.log("✅ Email configuration verified successfully");

    if (testEmail) {
      const testEmailContent = {
        subject: "Test Email - Restaurant Reservation System",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Test Email</h2>
            <p>This is a test email to verify that the email service is working correctly.</p>
            <p>If you receive this email, the configuration is working!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        `,
      };

      const result = await sendEmail(testEmail, testEmailContent);
      if (result.success) {
        console.log("✅ Test email sent successfully");
      } else {
        console.log("❌ Test email failed:", result.error);
      }
      return result;
    }

    return { success: true, message: "Email configuration verified" };
  } catch (error) {
    console.error("❌ Email configuration test failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendReservationPendingEmail,
  sendReservationConfirmationEmail,
  sendEmail,
  testEmailConfiguration,
};
