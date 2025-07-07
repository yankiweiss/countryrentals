const express = require('express');
const router = express.Router();
const path = require('path')
const registerController = require('../controllers/registerController.js')


router.post('/', registerController.handleNewUser)


module.exports = router;