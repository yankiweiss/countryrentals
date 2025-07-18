const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(req, res) {

    const { coverImageUrl, customerEmail, listingId  } = req.body || {};



    try {
        const session = await stripe.checkout.sessions.create({


            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Standard Rental Listing',
                            images: coverImageUrl ? [coverImageUrl] : [],

                        },
                        unit_amount: 25000
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `https://www.upstatekosherrentals.com/success?listingId=${listingId}`,
            cancel_url: 'https://www.upstatekosherrentals.com/cancel',
            allow_promotion_codes: true,
            customer_email: customerEmail,
            metadata: {
                listingId: listingId
            }


        });


        res.status(200).json({ url: session.url });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Stripe checkout session creation failed.' });
    }
}



module.exports = { createCheckoutSession };