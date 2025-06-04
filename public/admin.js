const tbody = document.getElementById("tbody");

function getAllListings() {
  fetch("https://countryrentals.vercel.app/listing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      displayListing(data);
      console.log(data);
      // You can now render the listings on the page here
    })
    .catch((err) => {
      console.error("Failed to get listings:", err);
      alert("Error fetching listings");
    });
}

getAllListings();

function displayListing(listings) {
  listings.forEach((listing, index) => {
    const row = document.createElement('tr');

    // Wrap each image in a container div (hidden by default)
    const imageHTML = listing.uploadedFiles
      .map(url => `<img src="${url}" width="200" style="margin: 5px;" />`)
      .join('');

    // Unique ID for each image container
    const imageContainerId = `image-container-${index}`;

    row.innerHTML = `
      <td>
    <input 
      class="form-check-input" 
      type="checkbox" 
      value="" 
      id="check-${index}" 
      onchange="updateStatus('${listing._id}', this.checked)"
    />
  </td>
      <td>${listing.address}</td>
      <td>${listing.description}</td>
       <td>${listing.email}</td>
       <td>${listing.name}</td>
      <td>${listing.phone}</td>
      <td>${listing.baths}</td>
      
      <td>${listing.bedrooms}</td>
     
     
      <td>
        <button onclick="toggleImages('${imageContainerId}')">Show Images</button>
        <div id="${imageContainerId}" style="display: none; margin-top: 5px;">
          ${imageHTML}
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function toggleImages(id) {
  const container = document.getElementById(id);
  if (container.style.display === 'none') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}


async function updateStatus(listingId, approved) {
  const newStatus = approved ? "approved" : "pending";

  try {
    const res = await fetch(`https://countryrentals.vercel.app/listing/${listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) throw new Error("Failed to update status");
    const data = await res.json();

    console.log("Status updated:", data);
    alert(`Status set to: ${newStatus}`);

    // Email notification after status update
    const subject = "Your listing status has been updated";
    const message = `Your listing with address "${data.address}" is now "${newStatus}".`;

    await fetch("https://countryrentals.vercel.app/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: data.email,  // notify the owner email
        subject,
        message,
      }),
    });

  } catch (err) {
    console.error("Error updating status:", err);
    alert("Failed to update listing status");
  }
}

