const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

// Now fetch listing data using that ID
fetch(`https://countryrentals.vercel.app/listing/${listingId}`)
  .then(res => res.json())
  .then(data => {
    // Display the listing details on the page
    console.log(data);
  });