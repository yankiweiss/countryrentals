const listingSection = document.getElementById('listings');

async function fetchListings() {
  try {
    const res = await fetch("https://www.upstatekosherrentals.com/listing");
<<<<<<< HEAD
    
=======
>>>>>>> 4ecc84c681016119eb853c7892c309591aae7fe7
    const data = await res.json();
    console.log(data);
    displayHomeListings(data);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

async function displayHomeListings(listings) {
  const listingsByCity = {};

  // Group listings by city
  for (const listing of listings) {
    const city = listing.city?.trim() || "Other";
    if (!listingsByCity[city]) {
      listingsByCity[city] = [];
    }
    listingsByCity[city].push(listing);
  }

  // Clear previous listings
  listingSection.innerHTML = "";

  // Build a section for each city
  for (const city in listingsByCity) {
    // SECTION for the city
    const citySection = document.createElement("section");
    citySection.className = "city-section";
    

    // Heading
    const heading = document.createElement("h2");
    heading.textContent = `Popular Rentals in ${city}.`;
    heading.className = 'city-heading'

    
   
    

    // Listings Row
    const listingRow = document.createElement("div");
    listingRow.className = "listing-row";
    

    // Add each listing to this city's row
    for (const listing of listingsByCity[city]) {
      const link = document.createElement("a");
      link.href = `listing.html?id=${listing._id}`;
      link.style.textDecoration = "none";
      link.style.color = "inherit";
      link.style.width = "300px";

      const card = document.createElement("div");
      card.className = "listing-card";
      card.style.border = "1px solid rgba(0, 45, 104, 0.1)";
      card.style.borderRadius = "15px";
      card.style.overflow = "hidden";
      card.style.boxShadow = "5px 10px 7px rgba(76, 154, 255, 0.1)";
      card.style.backgroundColor = "#fff";

      const img = new Image();
      img.src = listing.uploadedFiles?.[0] || "fallback.jpg";
      img.width = 325;
      img.height = 285;
      img.style.objectFit = "cover";
      img.style.display = "block";

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => {
          console.warn("Image failed to load:", img.src);
          resolve();
        };
      });

      const content = `
        <div style="padding: 10px;">
          <h5 style="margin: 0; text-align: center;">${listing.street}</h5>
          <div style="text-align: center; margin: 8px 0;">
            <span style="margin: 5px;"><strong><i class="fa-solid fa-bed"></i></strong> ${listing.bedrooms}</span>
            <span style="margin: 5px;"><strong><i class="fa-solid fa-bath"></i></strong> ${listing.baths}</span>
          </div>
        </div>
      `;

      card.appendChild(img);
      card.insertAdjacentHTML("beforeend", content);
      link.appendChild(card);
      listingRow.appendChild(link);
    }

    citySection.appendChild(heading);
    citySection.appendChild(listingRow);
    listingSection.appendChild(citySection);
  }
}

fetchListings();

// Email in the bottom going to upstatekosherlisting

document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;

  try {
    await fetch("https://www.upstatekosherrentals.com/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "upstatekosherrentals@gmail.com",
        subject: "Suggestion from Site",
        message,
      }),
    });
    alert("Thanks for Emailing us!");
    document.getElementById("message").value = "";
  } catch (err) {
    alert("Failed to send email");
    console.error(err);
  }
});