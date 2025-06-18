const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Listing = require('../model/Listing');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const listingId = session.metadata.listingId;

    try {
      const updated = await Listing.findByIdAndUpdate(
        listingId,
        { status: 'Approved' },
        { new: true }
      );

      console.log(`✅ Listing ${listingId} approved after payment.`);
    } catch (err) {
      console.error("❌ Failed to update listing status:", err);
    }
  }

  res.status(200).send('Event received');
});

module.exports = router;