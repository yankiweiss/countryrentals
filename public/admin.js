const allListings = document.getElementById('all-listings');

function getAllListings() {
  fetch("https://countryrentals.vercel.app/listing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      displayListing(data)
      console.log(data)
      // You can now render the listings on the page here
    })
    .catch(err => {
      console.error("Failed to get listings:", err);
      alert("Error fetching listings");
    });
}

getAllListings();

function displayListing(listings) {
  listings.forEach((listing) => {
    const div = document.createElement('div');
    div.className = 'listing';
    // Generate all image tags from uploadedFiles array
    const imageHTML = listing.uploadedFiles
      .map(url => `<img src="${url}" width="200" style="margin: 5px;" />`)
      .join('');

    div.innerHTML = `

      <h2><strong>Address:</strong>${listing.address}</h2>
      <p><strong>Phone:</strong> ${listing.phone}</p>
      <p><strong>Name:</strong> ${listing.name}</p>
      <p><strong>Email:</strong> ${listing.email}</p>
      <p><strong>Bedrooms:</strong> ${listing.bedrooms}</p>
      <p><strong>Baths:</strong> ${listing.baths}</p>
      <p><strong>Description:</strong>${listing.description}</p>
      <div>${imageHTML}</div>
    `;

    allListings.appendChild(div);
  });
}