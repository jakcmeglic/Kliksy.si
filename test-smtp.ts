import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

console.log("Testing SMTP setup...");
console.log("Host:", smtpHost);
console.log("Port:", smtpPort);
console.log("User:", smtpUser);
console.log("Pass is configured:", !!smtpPass);

if (!smtpHost || !smtpUser || !smtpPass) {
  console.error("Missing SMTP configuration in environment.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer Verify Error:", error);
  } else {
    console.log("Server is ready to take our messages");
    
    // Attempt sending a test mail
    const mailOptions = {
        from: `"Kliksy Test" <${smtpUser}>`,
        to: smtpUser, // sending to oneself
        subject: "Test Email from AI Studio",
        text: "This is a test to verify SMTP configuration.",
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Failed to send message:", err);
        } else {
            console.log("Message sent:", info.messageId);
        }
    });
  }
});
