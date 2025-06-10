const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload";
const UPLOAD_PRESET = "upsatecountryrental"; // must be valid and unsigned in your Cloudinary dashboard

const listingForm = document.getElementById("listing-form");

listingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(listingForm);
  const files = document.getElementById("files").files;

  const imageUrls = [];

  for (const file of files) {
    console.log(
      `Uploading ${file.name}, size: ${(file.size / 1024).toFixed(2)} KB`
    );

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
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
        continue; // skip this file
      }

      console.log(`Uploaded ${file.name} to Cloudinary:`, data.secure_url);
      imageUrls.push(data.secure_url);
    } catch (err) {
      console.error(`Cloudinary upload failed for ${file.name}`, err);
      alert(`Upload failed for ${file.name}`);
      return;
    }
  }

  console.log("All uploaded URLs:", imageUrls);

  if (imageUrls.length === 0) {
    alert("No images were successfully uploaded. Cannot submit listing.");
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
  };

  console.log("Sending to backend:", backendData);

  try {
    const listingRes = await fetch(
      "https://countryrentals.vercel.app/listing",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      }
    );

    const listingData = await listingRes.json();
    console.log("Listing created:", listingData);
    alert("Listing submitted successfully!");
    listingForm.reset();
    document.getElementById("files").value = "";

    // Notify admin
    await fetch("https://countryrentals.vercel.app/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "upstatekosherrentals@gmail.com",
        subject: "A new Listing has been Posted waiting to get Approval",
        message: "please get it approved",
      }),
    });

    // Notify user
    await fetch("https://countryrentals.vercel.app/email", {
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
  }
});
