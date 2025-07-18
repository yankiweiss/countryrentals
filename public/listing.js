const listingDisplay = document.getElementById('listing')
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

// Now fetch listing data using that ID
fetch(`https://www.upstatekosherrentals.com/listing/${listingId}`)
  .then(res => res.json())
  .then(data => {
    // Display the listing details on the page
    displayListing(data);
  });


function displayListing(listing) {
  const div = document.createElement("div");
  div.className = "listing";

  // Only show the first image initially
  const uploadFiles = listing.uploadedFiles;

  const thumbnailsHTML = uploadFiles.map(url => `
    <img 
      src="${url}" 
      class="thumbnail-img" 
      style="width: 300px;  object-fit: cover; margin: 5px; cursor: pointer;" 
    />
  `).join("");


  div.innerHTML = `

  <h5>${listing.tag}</h5><br>
    <img 
      id="main-listing-image" 
      src="${uploadFiles[0]}" 
      alt="Main listing image"
    /><br>

    <div id="thumbnails-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
      ${thumbnailsHTML}
    </div><br>
    <h5><span class="title">Address:</span>  ${listing.address}</h5><br>
    

    <h5 style="width: 60%; margin: auto;"><span class="title">Description:</span> ${listing.description}</h5><br>

    <hr style="width: 500px; margin: auto;">
    <br>

     <h5>
      <strong><i>Bedrooms:</i></strong> ${listing.bedrooms}
      <span style="margin-left: 10px;">
        <strong><i>Baths:</i></strong> ${listing.baths}
      </span>
    </h5><br>

    <div class="card mb-3" style="max-width: 320px; margin: 20px auto; padding: 15px; border-radius: 10px; background: #f9f9f9; border: 1px solid #ddd;">
  <h6 class="text-center mb-3">Availability</h6>
  <div id="availability-calendar"></div>
</div>
    
 



    <br>

    <hr style="width: 500px; margin: auto;">

    <br>

    <div class="card text-center mt-4">
  <div class="card-body">
    <h5 class="card-title">Contact the Owner</h5>
    <p><strong>Email:</strong> ${listing.email}</p>
    <p><strong>Phone:</strong> ${listing.phone}</p>
  </div>
</div>
    <hr style="width: 500px; margin: auto;">

    <br>
   
  `;


  listingDisplay.appendChild(div);


  const availableFrom = new Date(listing.availableFrom);
const availableUntil = new Date(listing.availableUntil);
const takenDates = (listing.takenDates || []).map(d => new Date(d));

flatpickr("#availability-calendar", {
  mode: "range",
  dateFormat: "Y-m-d",
  inline: true,
  minDate: availableFrom,
  maxDate: availableUntil,
  disable: takenDates,
  defaultDate: [availableFrom, availableUntil],  // <-- this shows the initial selected range
  clickOpens: false  // makes it view-only, user can't change selection
});

  // Add click event to open all images
  document.getElementById("main-listing-image").addEventListener("click", () => showImageGallery(uploadFiles));
   document.querySelectorAll(".thumbnail-img").forEach(img =>
    img.addEventListener("click", () => showImageGallery(uploadFiles))
   );
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


function formatDateToMMDDYY(dateString) {
  const date = new Date(dateString);
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}


