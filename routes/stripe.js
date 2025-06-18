const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/', stripeController.createCheckoutSession)

//router.post('/listing/approve', listingController.approveListingByEmailAndImage);
 

module.exports = router;
