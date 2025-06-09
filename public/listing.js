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

  // Only show the first image initially
  const firstImage = listing.uploadedFiles?.[0] || "";

  div.innerHTML = `
    <img 
      id="main-listing-image" 
      src="${firstImage}" 
      alt="Main listing image"
    /><br>
    <h5>${listing.address}</h5><br>
    <h5>
      <strong><i>Bedrooms:</i></strong> ${listing.bedrooms}
      <span style="margin-left: 10px;">
        <strong><i>Baths:</i></strong> ${listing.baths}
      </span>
    </h5><br>

    <h5>Owners Details:</h5>

    <h5>Email: ${listing.email}</h5>

    <h5>Email: ${listing.phone}</h5><br>
  `;

  listingDisplay.appendChild(div);

  // Add click event to open all images
  const mainImage = document.getElementById("main-listing-image");
  mainImage.addEventListener("click", () => showImageGallery(listing.uploadedFiles));
}

function showImageGallery(images) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.flexWrap = "wrap";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.overflowY = "auto";
  overlay.style.zIndex = "1000";
  overlay.id = "gallery-overlay";

  // Add each image
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "80vh";
    img.style.margin = "10px";
    overlay.appendChild(img);
  });

  // Close on click
  overlay.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  document.body.appendChild(overlay);
}
