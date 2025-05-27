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

const mailOptions = {
  from: process.env.MAIL_USERNAME,
  to: 'upstatekosherrentals@gmail.com',
  subject: 'Nodemailer Project',
  html: `
    <h1 style="color: green;">
      To go to your Listings 
      <a href="http://localhost:3000">Click here.</a>
    </h1>
    <br>
    <h1 style="color: red;">
      Or access our other projects 
      <a href="https://full-stack-plumbing-ecomerce.vercel.app/">Click here.</a>
    </h1>`,
};

router.get('/send', async (req, res) => {
  try {
    let info = await transporter.sendMail(mailOptions);
    res.send('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send('Failed to send email');
  }
});

module.exports = router;