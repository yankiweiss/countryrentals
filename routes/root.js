const express = require('express');
const router = express.Router();
const path = require('path')


router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

router.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'success.html'));
});

router.get("/signIn", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signIn.html'));
});

router.get("/signUp", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signUp.html'));
});

router.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'testing.html'));
});


module.exports = router;