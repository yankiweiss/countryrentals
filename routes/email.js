const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

function sendCustomEmail(recipient, subjectText, messageText) {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: recipient,
    subject: subjectText,
    text: messageText, // or use html: "<b>HTML version</b>"
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}


router.post('/', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).send('Missing "to", "subject", or "message"');
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      text: message,
    });
    res.status(200).send('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send('Failed to send email');
  }
});


module.exports = router;