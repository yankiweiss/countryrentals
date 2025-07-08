document.addEventListener("DOMContentLoaded", async () => {
  const addListingBtn = document.getElementById("add-listing");
  const listingForm = document.getElementById("list-form");
  const listingsSection = document.getElementById("listings-section");
  const listingsContainer = document.getElementById("listings-container");

  if (!addListingBtn || !listingForm || !listingsSection || !listingsContainer) return;

  addListingBtn.addEventListener("click", () => {
    const isFormHidden = listingForm.classList.contains("listing-hidden");

    if (isFormHidden) {
      listingForm.classList.remove("listing-hidden");
      listingsSection.style.display = "none";
      addListingBtn.textContent = "Close";
    } else {
      listingForm.classList.add("listing-hidden");
      listingsSection.style.display = "block";
      addListingBtn.textContent = "+ Add New Listing";
    }
  });

  const email = localStorage.getItem("loggedInEmail") || "";
  if (!email) {
    listingsContainer.innerHTML = `<p class="text-center text-danger">No user email found.</p>`;
    return;
  }

  try {
    const res = await fetch(`/listing/email?email=${encodeURIComponent(email)}`);
    const listings = await res.json();
    window.currentListings = listings;

    if (!listings.length) {
      listingsContainer.innerHTML = `<p class="text-center">You have no listings yet.</p>`;
      return;
    }

    listings.forEach((listing) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
      <div class="card listing-card text-center position-relative">
        <img src="${(listing.uploadedFiles && listing.uploadedFiles.length > 0) ? listing.uploadedFiles[0] : 'https://via.placeholder.com/400x200?text=No+Image'}" class="card-img-top listing-img" alt="Listing Image" />
        <div class="card-body">
          <h5 class="card-title listing-title">${listing.name || "Untitled Listing"}</h5>
          <p class="card-text">${listing.address || "No address provided"}</p>

          <button class="btn btn-outline-primary btn-sm edit-btn mt-2 me-2" data-id="${listing._id}">Edit</button>
          <button class="btn btn-outline-danger btn-sm delete-btn mt-2" data-id="${listing._id}">Delete</button>
        </div>
      </div>
      `;

      const editBtn = col.querySelector(".edit-btn");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openInlineEditForm(listing._id);
      });

      const deleteBtn = col.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const confirmed = confirm("Are you sure you want to delete this listing?");
        if (!confirmed) return;

        try {
          const res = await fetch(`https://upstatekosherrentals.com/listing/${listing._id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete listing");

          alert("Listing deleted.");
          col.remove();
        } catch (err) {
          console.error(err);
          alert("Error deleting listing.");
        }
      });

      listingsContainer.appendChild(col);
    });
  } catch (err) {
    listingsContainer.innerHTML = `<p class="text-danger">Failed to load listings.</p>`;
    console.error(err);
  }

  // Your property option & form step logic here...

  // (You can just copy your existing second DOMContentLoaded logic here)
});


// Editing a exiting Listing

  function openInlineEditForm(listingId) {
  const card = document.querySelector(`button[data-id="${listingId}"]`).closest(".card");
  const title = card.querySelector(".listing-title").textContent.trim();
  const address = card.querySelector(".card-text").textContent.trim();
  const listing = window.currentListings.find(l => l._id === listingId);

  const takenRanges = listing.takenDates || []; // This should be array of {from, to}

  card.innerHTML = `
    <div class="card-body">
      <h5 class="mb-4">Edit Listing</h5>

      <div class="row mb-3">
        <div class="col">
          <label for="edit-title-${listingId}" class="form-label">Name</label>
          <input type="text" class="form-control" id="edit-title-${listingId}" value="${title}" placeholder="Listing Name" />
        </div>
        <div class="col">
          <label for="edit-email-${listingId}" class="form-label">Email</label>
          <input type="email" class="form-control" id="edit-email-${listingId}" value="${listing.email || ''}" placeholder="Contact email" />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <label for="edit-baths-${listingId}" class="form-label">Baths</label>
          <input type="number" min="0" class="form-control" id="edit-baths-${listingId}" value="${listing.baths || ''}" />
        </div>
        <div class="col">
          <label for="edit-bedrooms-${listingId}" class="form-label">Bedrooms</label>
          <input type="number" min="0" class="form-control" id="edit-bedrooms-${listingId}" value="${listing.bedrooms || ''}" />
        </div>
      </div>

      <div class="mb-3">
        <label for="edit-description-${listingId}" class="form-label">Description</label>
        <textarea class="form-control" id="edit-description-${listingId}" rows="3">${listing.description || ''}</textarea>
      </div>

      <div class="mb-3">
        <label for="edit-address-${listingId}" class="form-label">Address</label>
        <input type="text" class="form-control" id="edit-address-${listingId}" value="${address}" />
      </div>

      <div class="mb-3">
        <label class="form-label">Add Taken Date Range</label>
        <input id="flatpickr-range-${listingId}" class="form-control mb-2" placeholder="Select date range" />
        <button class="btn btn-primary btn-sm mb-2" id="add-range-btn-${listingId}">Add Range</button>
        <div id="taken-dates-list-${listingId}" class="mb-2"></div>
        <input type="hidden" id="taken-dates-${listingId}" />
      </div>

      <button class="btn btn-success btn-sm" onclick="submitEdit('${listingId}')">Save</button>
      <button class="btn btn-secondary btn-sm ms-2" onclick="location.reload()">Cancel</button>
    </div>
  `;

  let takenDates = [...takenRanges]; // Store in memory

  // Initialize Flatpickr
  let selectedRange = [];
  const fp = flatpickr(`#flatpickr-range-${listingId}`, {
    mode: "range",
    dateFormat: "Y-m-d",
    onChange: (selectedDates) => {
      selectedRange = selectedDates;
    }
  });

  // Add range button
  document.getElementById(`add-range-btn-${listingId}`).addEventListener("click", () => {
    if (selectedRange.length === 2) {
      const from = selectedRange[0].toISOString().split("T")[0];
      const to = selectedRange[1].toISOString().split("T")[0];
      takenDates.push({ from, to });
      selectedRange = [];
      fp.clear();
      updateTakenDates();
    } else {
      alert("Please select a date range.");
    }
  });

  function updateTakenDates() {
    // update hidden input
    document.getElementById(`taken-dates-${listingId}`).value = JSON.stringify(takenDates);

    // render list
    const container = document.getElementById(`taken-dates-list-${listingId}`);
    container.innerHTML = "";
    takenDates.forEach((range, i) => {
      const div = document.createElement("div");
      div.innerHTML = `From: ${range.from} To: ${range.to} <button class="btn btn-sm btn-danger ms-2" onclick="removeRange(${i}, '${listingId}')">Remove</button>`;
      container.appendChild(div);
    });
  }

  window.removeRange = function(index, listingId) {
    takenDates.splice(index, 1);
    updateTakenDates();
  };

  // Initial load
  updateTakenDates();
}


async function submitEdit(listingId) {
  const newTitle = document.getElementById(`edit-title-${listingId}`).value.trim();
  const newBaths = document.getElementById(`edit-baths-${listingId}`).value.trim();
  const newBedrooms = document.getElementById(`edit-bedrooms-${listingId}`).value.trim();
  const newDescription = document.getElementById(`edit-description-${listingId}`).value.trim();
  const newEmail = document.getElementById(`edit-email-${listingId}`).value.trim();
  const newAddress = document.getElementById(`edit-address-${listingId}`).value.trim();
  const takenDates = JSON.parse(document.getElementById(`taken-dates-${listingId}`).value || "[]");

  const updatedData = {
    name: newTitle,
    baths: newBaths,
    bedrooms: newBedrooms,
    description: newDescription,
    email: newEmail,
    address: newAddress,
    takenDates,
  };

  try {
    const res = await fetch(`https://upstatekosherrentals.com/listing/${listingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update");

    alert("Listing updated!");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }
}

  // Creating a new Listing

document.addEventListener("DOMContentLoaded", () => {
  const propertyOptions = document.querySelectorAll(".property-option");
  const listForm = document.getElementById("list-form");
  const addressSection = document.getElementById("address");
  const bedAndBathsSection = document.getElementById("bedAndBaths");
  const datesSection = document.getElementById("dates-available");
  const progressBar = document.getElementById("progressBar");
  const addressInput = document.getElementById("search_input");
  const descriptionSection = document.getElementById("descriptionSection");
  const listingDescription = document.getElementById("listingDescription");
  const bedroomSelect = document.getElementById("bedroomSelect");
  const bathSelect = document.getElementById("bathSelect");

  

  // === Step 1: Select property type ===
  propertyOptions.forEach(option => {
    option.addEventListener("click", () => {
      const type = option.getAttribute("data-type");
      localStorage.setItem("selectedPropertyType", type);
      listForm.classList.add("listing-hidden");
      addressSection.classList.remove("listing-hidden");
      bedAndBathsSection.classList.add("listing-hidden");

      progressBar.style.width = "50%";
      progressBar.textContent = "50%";
    });
  });

  // === Step 2: Address input ===
  function saveAddressAndProceed() {
    const address = addressInput.value.trim();
    if (!address) return;

    localStorage.setItem("address", address);
    addressSection.classList.add("listing-hidden");
    bedAndBathsSection.classList.remove("listing-hidden");

    progressBar.style.width = "75%";
    progressBar.textContent = "75%";

    if (bedroomSelect) bedroomSelect.focus();
  }

  addressInput.addEventListener("blur", saveAddressAndProceed);
  addressInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveAddressAndProceed();
    }
  });

  // === Step 3: Bedrooms and baths ===
  bathSelect.addEventListener("change", () => {
    const bedrooms = bedroomSelect.value;
    const baths = bathSelect.value;

    if (!bedrooms || !baths) {
      alert("Please select both bedrooms and baths.");
      return;
    }

    localStorage.setItem("bedrooms", bedrooms);
    localStorage.setItem("baths", baths);

    bedAndBathsSection.classList.add("listing-hidden");
    datesSection.classList.remove("listing-hidden");

    progressBar.style.width = "90%";
    progressBar.textContent = "90%";

    const availableFrom = document.getElementById("availableFrom");
    if (availableFrom) availableFrom.focus();
  });

  // === Step 4: Dates ===
  document.getElementById("availableFrom").addEventListener("change", (e) => {
    localStorage.setItem("availableFrom", e.target.value);
  });

  document.getElementById("availableUntil").addEventListener("change", (e) => {
    localStorage.setItem("availableUntil", e.target.value);

    if (descriptionSection) {
      descriptionSection.classList.remove("listing-hidden");
    }

    progressBar.style.width = "100%";
    progressBar.textContent = "100%";

    const textarea = descriptionSection.querySelector("textarea");
    if (textarea) textarea.focus();
  });

  // === Final Step: Submit on description blur ===
  listingDescription.addEventListener("blur", async () => {
    const description = listingDescription.value.trim();

    if (!description) {
      alert("Please enter a description before continuing.");
      return;
    }

    const propertyType = localStorage.getItem("selectedPropertyType");
    const address = localStorage.getItem("address");
    const bedrooms = localStorage.getItem("bedrooms");
    const email = localStorage.getItem("loggedInEmail") || "no-reply@example.com";
    const baths = localStorage.getItem("baths");
    const name = "Jacob Weiss"; // Optional: make dynamic later
    let takenDates = [];
    

    const listingData = {
      propertyType,
      address,
      bedrooms,
      baths,
      takenDates,
      description,
      email,
      name,
      takenDates
    };

    // === Validate required fields ===
    if (!propertyType || !address || !bedrooms || !baths ) {
      alert("Some listing details are missing or taken dates are not set. Please complete the form.");
      return;
    }

    console.log(listingData)

    try {
      const response = await fetch("https://upstatekosherrentals.com/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData)
      });

      if (response.ok) {
        const result = await response.json();
        alert("Listing submitted successfully!");
        console.log("Server response:", result);

        localStorage.clear();
        window.location.href = "/listing-success";
      } else {
        const error = await response.json();
        console.error("Submission error:", error);
        alert("Submission failed: " + (error.message || "Try again."));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("An error occurred while submitting your listing.");
    }
  });
});


//const CLOUDINARY_UPLOAD_URL =
//  "https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload";
//const UPLOAD_PRESET = "upsatecountryrental"; // must be valid and unsigned in your Cloudinary dashboard
//
//const overlay = document.getElementById("submission-overlay");
//
//const toastBody = document.getElementById("toast-body");
//
//const listingForm = document.getElementById("listing-form");
//
//const checkmark = document.getElementById("checkmark");
//const overlayText = document.getElementById("overlay-text");
//
//listingForm.addEventListener("submit", async (e) => {
//  e.preventDefault()
//  overlay.style.display = "flex";
//  spinner.style.display = "block";
//  checkmark.style.display = "none";
//  overlayText.innerHTML =
//    "Submitting your data...<br />Please do not refresh or navigate away.";
//
//  const formData = new FormData(listingForm);
//  const defaultImageFile = document.getElementById("defaultImage").files[0];
//  const otherFiles = document.getElementById("files").files;
//
//  const imageUrls = [];
//
//  if (defaultImageFile) {
//    try {
//      const uploadData = new FormData();
//      uploadData.append("file", defaultImageFile);
//      uploadData.append("upload_preset", UPLOAD_PRESET);
//      uploadData.append("folder", "listings");
//
//      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
//        method: "POST",
//        body: uploadData,
//      });
//
//      const data = await res.json();
//
//      if (!res.ok || !data.secure_url) {
//        console.error(`Upload failed for ${file.name}`, data);
//        alert(`Failed to upload ${file.name}: ${JSON.stringify(data)}`);
//        return; // skip this file
//      }
//
//      imageUrls.push(data.secure_url);
//    } catch (err) {
//      document.getElementById("spinner").style.display = "none";
//      document.getElementById("checkmark").style.display = "none";
//      const toastEl = document.getElementById("error-icon");
//      const toast = new bootstrap.Toast(toastEl, { autohide: false });
//      toast.show();
//      toastBody.innerText = "Cover Image failed to upload!";
//      const overlay = document.getElementById("submission-overlay");
//      overlay.style.display = "none";
//
//      return;
//    }
//  } else {
//    document.getElementById("spinner").style.display = "none";
//    document.getElementById("checkmark").style.display = "none";
//
//    const toastEl = document.getElementById("error-icon");
//    const toast = new bootstrap.Toast(toastEl, { autohide: false });
//    toast.show();
//    toastBody.innerText = "Cover image is required";
//    const overlay = document.getElementById("submission-overlay");
//    overlay.style.display = "none";
//
//    return;
//  }
//
//  const uploadPromises = Array.from(otherFiles).map((file) => {
//    const uploadData = new FormData();
//    uploadData.append("file", file);
//    uploadData.append("upload_preset", UPLOAD_PRESET);
//    uploadData.append("folder", "listings");
//
//    return fetch(CLOUDINARY_UPLOAD_URL, {
//      method: "POST",
//      body: uploadData,
//    }).then((res) => res.json());
//  });
//
//  try {
//    const results = await Promise.all(uploadPromises);
//    results.forEach((data) => {
//      if (data.secure_url) imageUrls.push(data.secure_url);
//    });
//  } catch (err) {
//    alert("One or more image uploads failed.");
//    return;
//  }
//
//  // Split address into parts
//  const fullAddress = formData.get("address") || "";
//  const parts = fullAddress.split(",").map((p) => p.trim());
//  const street = parts[0] || "";
//  const city = parts[1] || "";
//  const state = parts[2] || "";
//
//  const backendData = {
//    name: formData.get("name"),
//    address: fullAddress,
//    street,
//    city,
//    state,
//    baths: formData.get("baths"),
//    bedrooms: formData.get("bedrooms"),
//    email: formData.get("email"),
//    phone: formData.get("phone"),
//    tag: formData.get("tag"),
//    availableFrom: formData.get("availableFrom"),
//    availableUntil: formData.get("availableUntil"),
//    description: formData.get("description"),
//    uploadedFiles: imageUrls,
//  };
//
//  try {
//    const listingRes = await fetch(
//      "https://www.upstatekosherrentals.com/listing",
//      {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify(backendData),
//      }
//
//    );
//
//    const listingData = await listingRes.json();
//    const listingId = listingData._id || listingData.id;
//
//
//
//    listingForm.reset();
//    document.getElementById("files").value = "";
//
//    try {
//
//      const coverImageUrl = imageUrls[0] || null;
//
//      const stripeRes = await fetch("https://www.upstatekosherrentals.com/checkout", {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({
//          coverImageUrl,
//          customerEmail: formData.get("email"),
//          listingId
//
//        }),
//      });
//      const stripeData = await stripeRes.json();
//
//      if (stripeData.url) {
//        window.location.href = stripeData.url; // ← Manual redirect to Stripe
//      } else {
//        throw new Error("No URL returned from Stripe");
//      }
//    } catch (err) {
//      console.error("Stripe redirect failed:", err);
//      alert("Could not redirect to Stripe checkout.");
//    }
//
//    // Notify admin
//    await fetch("https://www.upstatekosherrentals.com/email", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({
//        to: "upstatekosherrentals@gmail.com",
//        subject: "A new Listing has been Posted waiting to get Approval",
//        message: "please get it approved",
//      }),
//    });
//
//    // Notify user
//    await fetch("https://www.upstatekosherrentals.com/email", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({
//        to: formData.get("email"),
//        subject: "Your Listing Has Been Submitted",
//        message: `Hi,\n\nThanks for submitting your listing to Upstate Kosher Rentals!\nYour listing is currently live.\n\n- The Upstate Kosher Rental Team`,
//      }),
//    });
//  } catch (err) {
//    console.error("Failed to submit listing or send emails:", err);
//    alert("Error submitting listing. Please try again.");
//  } finally {
//    setTimeout(() => {
//      spinner.style.display = "none";
//      checkmark.style.display = "block";
//      overlayText.textContent = "Submitted successfully!";
//
//      // Optional: hide overlay after a short delay
//      setTimeout(() => {
//        overlay.style.display = "none";
//      }, 500);
//    }, 500);
//  }
//
//
//});
