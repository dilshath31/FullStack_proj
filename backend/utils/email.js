const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;

async function initTransporter() {
  if (!transporter) {
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD && process.env.SMTP_EMAIL !== "your_email@gmail.com") {
      // Use Real SMTP (e.g., Gmail)
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      console.log("Real Email Server ready using:", process.env.SMTP_EMAIL);
    } else {
      // Generate test SMTP service account from ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log("Mock Email Server ready. User:", testAccount.user);
    }
  }
}

const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    await initTransporter();
    
    const info = await transporter.sendMail({
      from: '"Ticket Booking System" <no-reply@ticketbooking.com>',
      to,
      subject,
      html,
      attachments
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
