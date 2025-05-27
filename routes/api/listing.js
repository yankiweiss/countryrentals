const express = require('express');
const router = express.Router();
const path = require('path');
const listingController = require('../../controllers/listingController.js')


router.route('/').get(listingController.getAllListing)
.post(listingController.createNewListing)
    

module.exports = router;