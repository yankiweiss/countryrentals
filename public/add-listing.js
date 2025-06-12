const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dhwtnj8eb/image/upload";
const UPLOAD_PRESET = "upsatecountryrental"; // must be valid and unsigned in your Cloudinary dashboard

const listingForm = document.getElementById("listing-form");


const spinner = document.getElementById("form-spinner");

listingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  spinner.style.display = "block";
  spinner.style.margin = "auto"

  const formData = new FormData(listingForm);
  const defaultImageFile = document.getElementById("defaultImage").files[0];
  const otherFiles = document.getElementById("files").files;
  

  const imageUrls = [];

  if(defaultImageFile){

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
      
      alert(`Upload failed for cover image`);
      return;
    }
  } else {
    alert('Please upload a cover image');
    return
  }


  for (const file of otherFiles){

    try{
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append("upload_preset", UPLOAD_PRESET);
      uploadData.append('folder', 'listings')

      

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body : uploadData,
      })
    

    const data = await res.json();


    if(!res.ok || !data.secure_url){
      alert(`Failed to upload ${file.name} : ${JSON.stringify(data)}`)
      continue;
    }

    imageUrls.push(data.secure_url);
    localStorage.setItem("listing", JSON.stringify(uploadData));
  } 
  catch(err){
    alert(`Upload failed for ${file.name}`)
    return;
  }
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

  localStorage.setItem("listing", JSON.stringify(backendData));

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

    const listingData = await listingRes.json();
    console.log("Listing created:", listingData);
    alert("Listing submitted successfully!");
    listingForm.reset();
    document.getElementById("files").value = "";

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
  }finally {
    spinner.style.display = "none"; // Hide spinner
  }
});


