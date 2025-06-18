const tbody = document.getElementById("tbody");

function getAllListings() {
  fetch("https://www.upstatekosherrentals.com/listing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      displayListing(data)
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

    // Dropdown options with current status selected
    const statusOptions = ['Approved', 'Rejected', 'pending'];
    const optionsHTML = statusOptions.map(status => {
      const selected = listing.status === status ? 'selected' : '';
      return `<option value="${status}" ${selected}>${status}</option>`;
    }).join('');

    row.innerHTML = `
      <td>
        <select class="form-select" aria-label="Status select" onchange="updateStatus('${listing._id}', this.value)">
          <option disabled>Status:</option>
          ${optionsHTML}
        </select>
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


async function updateStatus(listingId, newStatus) {
  try {
    const res = await fetch(`https://www.upstatekosherrentals.com/listing/${listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) throw new Error("Failed to update status");
    const data = await res.json();

    console.log("Status updated:", data);
    alert(`Status updated to: ${newStatus}`);

    // Email notification
    const subject = "Your listing status has been updated";
    const message = `Your listing at "${data.address}" is now marked as "${newStatus}".`;

    await fetch("https://www.upstatekosherrentals.com/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: data.email,
        subject,
        message,
      }),
    });

  } catch (err) {
    console.error("Error updating status:", err);
    alert("Failed to update listing status");
  }
}
