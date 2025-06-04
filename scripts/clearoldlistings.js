const mongoose = require('mongoose');
const Listing = require('../model/Listing'); // Adjust path as needed

mongoose.connect('process.env.DATABASE_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  const result = await Listing.deleteMany({});
  console.log(`Deleted ${result.deletedCount} listings.`);
  mongoose.disconnect();
})
.catch(err => {
  console.error("Error connecting to MongoDB:", err);
});