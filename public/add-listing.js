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



  function openInlineEditForm(listingId) {
    const card = document.querySelector(`button[data-id="${listingId}"]`).closest(".card");
    const title = card.querySelector(".listing-title").textContent.trim();
    const address = card.querySelector(".card-text").textContent.trim();

    card.innerHTML = `
      <div class="card-body">
        <h5>Edit Listing</h5>
        <div class="mb-2">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" id="edit-title-${listingId}" value="${title}" />
        </div>
        <div class="mb-2">
          <label class="form-label">Address</label>
          <input type="text" class="form-control" id="edit-address-${listingId}" value="${address}" />
        </div>
        <button class="btn btn-success btn-sm" onclick="submitEdit('${listingId}')">Save</button>
        <button class="btn btn-secondary btn-sm ms-2" onclick="location.reload()">Cancel</button>
      </div>
    `;
  }

  

  async function submitEdit(listingId) {
    const newTitle = document.getElementById(`edit-title-${listingId}`).value.trim();
    const newAddress = document.getElementById(`edit-address-${listingId}`).value.trim();

    try {
      const res = await fetch(`https://upstatekosherrentals.com/listing/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTitle, address: newAddress }),
      });

      if (!res.ok) throw new Error("Failed to update");

      alert("Listing updated!");
      location.reload(); // refresh to reflect changes
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  }

  

document.addEventListener("DOMContentLoaded", () => {
  const propertyOptions = document.querySelectorAll(".property-option");
  const listForm = document.getElementById("list-form");
  const addressSection = document.getElementById("address");
  const bedAndBathsSection = document.getElementById("bedAndBaths");
  const datesSection = document.getElementById("dates-available");
  const progressBar = document.getElementById("progressBar");
  const addressInput = document.getElementById("search_input");
  const descriptionSection = document.getElementById("descriptionSection");
  

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

  // After address input: save and show bedrooms & baths
  function saveAddressAndProceed() {
    const address = addressInput.value.trim();
    if (!address) return;

    localStorage.setItem("address", address);
    addressSection.classList.add("listing-hidden");
    bedAndBathsSection.classList.remove("listing-hidden");
    

    progressBar.style.width = "75%";
    progressBar.textContent = "75%";

    const bedroomSelect = document.getElementById("bedroomSelect");
    if (bedroomSelect) bedroomSelect.focus();
  }

  addressInput.addEventListener("blur", saveAddressAndProceed);
  addressInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveAddressAndProceed();
    }
  });

  // When baths are selected: save both bedrooms & baths, then show dates
  const bedroomSelect = document.getElementById("bedroomSelect");
  const bathSelect = document.getElementById("bathSelect");

  bathSelect.addEventListener("change", () => {
    const bedrooms = bedroomSelect.value;
    const baths = bathSelect.value;

    if (!bedrooms || !baths) {
      alert("Please select both bedrooms and baths.");
      return;
    }

    localStorage.setItem("bedrooms", bedrooms);
    localStorage.setItem("baths", baths);

    // Hide bed/baths section, show dates section
    bedAndBathsSection.classList.add("listing-hidden");
    datesSection.classList.remove("listing-hidden");

    progressBar.style.width = "90%";
    progressBar.textContent = "90%";

    // Optionally focus "Available From"
    const availableFrom = document.getElementById("availableFrom");
    if (availableFrom) availableFrom.focus();
  });

  // Optionally, save dates to localStorage on change as well:
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

  
  });



  document.getElementById("listingDescription").addEventListener("blur", async () => {
  const description = document.getElementById("listingDescription").value.trim();

  if (!description) {
    alert("Please enter a description before continuing.");
    return;
  }

  // Retrieve values from localStorage
  const propertyType = localStorage.getItem("selectedPropertyType");
  const address = localStorage.getItem("address");
  const bedrooms = localStorage.getItem("bedrooms");
  const email = localStorage.getItem("loggedInEmail");
  const baths = localStorage.getItem("baths");
  const availableFrom = localStorage.getItem("availableFrom");
  const availableUntil = localStorage.getItem("availableUntil");
  const name = "Jacob Weiss"

  // Construct the data object
  const listingData = {
    propertyType,
    address,
    bedrooms,
    baths,
    availableFrom,
    availableUntil,
    description,
    email,
    name
  };

  console.log(listingData)

  // Validate all fields exist
  if (!propertyType || !address || !bedrooms || !baths || !availableFrom || !availableUntil) {
    alert("Some listing details are missing. Please go back and complete the form.");
    return;
  }

  try {
    const response = await fetch("https://upstatekosherrentals.com/listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(listingData)
    });

    if (response.ok) {
      const result = await response.json();
      alert("Listing submitted successfully!");
      console.log("Server response:", result);

      // Optionally clear localStorage:
      localStorage.clear();

      // Redirect or proceed
      window.location.href = "/listing-success";
    } else {
      const error = await response.json();
      console.log(propertyType)
      console.error("Submission error:", error);
      alert("Submission failed: " + (error.message || "Try again."));
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("An error occurred while submitting your listing.");
  }
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
