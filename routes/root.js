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



module.exports = router;