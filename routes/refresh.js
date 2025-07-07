const express = require('express');
const router = express.Router();
const path = require('path')
const refreshController = require('../controllers/refreshTokenController')


router.post('/', refreshController.handleRefreshToken)


module.exports = router;