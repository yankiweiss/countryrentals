const listingDisplay = document.getElementById('listing')
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

// Now fetch listing data using that ID
fetch(`https://countryrentals.vercel.app/listing/${listingId}`)
  .then(res => res.json())
  .then(data => {
    // Display the listing details on the page
    displayListing(data);
  });


  function displayListing(listing) {
 
    const div = document.createElement("div");
    div.className = "listing";
    div.innerHTML = `
  
        <img src="${listing.uploadedFiles[0]}" width="250" style="margin: 5px;" />
        <h5>${listing.address}</h5>
        <h5>
          <strong><i>Bedrooms:</i></strong> ${listing.bedrooms}
          <span style="margin-left: 10px;">
            <strong><i>Baths:</i></strong> ${listing.baths}
          </span>
        </h5>
      </a>
    `;
    listingDisplay.appendChild(div);
  }
