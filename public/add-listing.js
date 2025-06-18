const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload";
const UPLOAD_PRESET = "upsatecountryrental"; // must be valid and unsigned in your Cloudinary dashboard

const overlay = document.getElementById("submission-overlay");

const toastBody = document.getElementById("toast-body");

const listingForm = document.getElementById("listing-form");

const checkmark = document.getElementById("checkmark");
const overlayText = document.getElementById("overlay-text");

listingForm.addEventListener("submit", async (e) => {
e.preventDefault()
  overlay.style.display = "flex";
  spinner.style.display = "block";
  checkmark.style.display = "none";
  overlayText.innerHTML =
    "Submitting your data...<br />Please do not refresh or navigate away.";

  const formData = new FormData(listingForm);
  const defaultImageFile = document.getElementById("defaultImage").files[0];
  const otherFiles = document.getElementById("files").files;

  const imageUrls = [];

  if (defaultImageFile) {
    try {
      const uploadData = new FormData();
      uploadData.append("file", defaultImageFile);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      uploadData.append("folder", "listings");

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        console.error(`Upload failed for ${file.name}`, data);
        alert(`Failed to upload ${file.name}: ${JSON.stringify(data)}`);
        return; // skip this file
      }

      imageUrls.push(data.secure_url);
    } catch (err) {
            document.getElementById("spinner").style.display = "none";
            document.getElementById("checkmark").style.display = "none";
           const toastEl = document.getElementById("error-icon");
    const toast = new bootstrap.Toast(toastEl, { autohide: false });
    toast.show();
    toastBody.innerText = "Cover Image failed to upload!";
    const overlay = document.getElementById("submission-overlay");
    overlay.style.display = "none";

      return;
    }
  } else {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("checkmark").style.display = "none";

    const toastEl = document.getElementById("error-icon");
    const toast = new bootstrap.Toast(toastEl, { autohide: false });
    toast.show();
    toastBody.innerText = "Cover image is required";
    const overlay = document.getElementById("submission-overlay");
    overlay.style.display = "none";

    return;
  }

  const uploadPromises = Array.from(otherFiles).map((file) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", UPLOAD_PRESET);
    uploadData.append("folder", "listings");

    return fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: uploadData,
    }).then((res) => res.json());
  });

  try {
    const results = await Promise.all(uploadPromises);
    results.forEach((data) => {
      if (data.secure_url) imageUrls.push(data.secure_url);
    });
  } catch (err) {
    alert("One or more image uploads failed.");
    return;
  }

  // Split address into parts
  const fullAddress = formData.get("address") || "";
  const parts = fullAddress.split(",").map((p) => p.trim());
  const street = parts[0] || "";
  const city = parts[1] || "";
  const state = parts[2] || "";

  const backendData = {
    name: formData.get("name"),
    address: fullAddress,
    street,
    city,
    state,
    baths: formData.get("baths"),
    bedrooms: formData.get("bedrooms"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    tag: formData.get("tag"),
    availableFrom: formData.get("availableFrom"),
    availableUntil: formData.get("availableUntil"),
    description: formData.get("description"),
    uploadedFiles: imageUrls,
    status : 'Pending',
  };

 

  console.log("Sending to backend:", backendData);

  try {
    const listingRes = await fetch(
      "https://www.upstatekosherrentals.com/listing",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      }
    );

   

    listingForm.reset();
    document.getElementById("files").value = "";

    try {

      const coverImageUrl = imageUrls[0] || null;
     

      
 const stripeRes = await fetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    coverImageUrl,
    customerEmail: formData.get("email")  

  }), 
  });
  const stripeData = await stripeRes.json();
  console.log(stripeData)
  if (stripeData.url) {
    window.location.href = stripeData.url; // ← Manual redirect to Stripe
  } else {
    throw new Error("No URL returned from Stripe");
  }
} catch (err) {
  console.error("Stripe redirect failed:", err);
  alert("Could not redirect to Stripe checkout.");
}

    // Notify admin
    await fetch("https://www.upstatekosherrentals.com/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "upstatekosherrentals@gmail.com",
        subject: "A new Listing has been Posted waiting to get Approval",
        message: "please get it approved",
      }),
    });

    // Notify user
    await fetch("https://www.upstatekosherrentals.com/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: formData.get("email"),
        subject: "Your Listing Has Been Submitted",
        message: `Hi,\n\nThanks for submitting your listing to Upstate Kosher Rentals!\nYour listing is currently live.\n\n- The Upstate Kosher Rental Team`,
      }),
    });
  } catch (err) {
    console.error("Failed to submit listing or send emails:", err);
    alert("Error submitting listing. Please try again.");
  } finally {
    setTimeout(() => {
      spinner.style.display = "none";
      checkmark.style.display = "block";
      overlayText.textContent = "Submitted successfully!";

      // Optional: hide overlay after a short delay
      setTimeout(() => {
        overlay.style.display = "none";
      }, 500);
    }, 500);
  }

  
});
