const listingSection = document.getElementById('listings');

async function fetchListings() {
  try {
    const res = await fetch("https://www.upstatekosherrentals.com/listing");
    
    const data = await res.json();
    const approvedListings = data.filter(listing => listing.status === 'approved')
    console.log(data);
    displayHomeListings(approvedListings);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

async function displayHomeListings(listings) {
  const listingsByCity = {};

  for (const listing of listings) {
    const city = listing.city?.trim() || "Other";
    if (!listingsByCity[city]) {
      listingsByCity[city] = [];
    }
    listingsByCity[city].push(listing);
  }

  listingSection.innerHTML = "";

  for (const city in listingsByCity) {
    const citySection = document.createElement("section");
    citySection.className = "city-section";

    const heading = document.createElement("h2");
    heading.textContent = `Popular Rentals in ${city}.`;
    heading.className = 'city-heading';

    const listingRow = document.createElement("div");
    listingRow.className = "listing-row";

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
      //card.style.minHeight = "400px";

      // Image wrapper
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "imgWrapper";
      //imgWrapper.style.width = "100%";
      //imgWrapper.style.height = "285px";
      //imgWrapper.style.overflow = "hidden";
      //imgWrapper.style.backgroundColor = "#f2f2f2";

      const img = new Image();
      img.src = listing.uploadedFiles?.[0] || "fallback.jpg";
      img.alt = listing.street || "Rental Image";
      //img.loading = "lazy";
      //img.style.width = "100%";
      //img.style.height = "100%";
      //img.style.objectFit = "cover";
      //img.style.display = "block";

      // No await needed
      imgWrapper.appendChild(img);
      card.appendChild(imgWrapper);

      const content = `
        <div style="padding: 10px;">
          <h5 style="margin: 0; text-align: center;">${listing.street}</h5>
          <div style="text-align: center; margin: 8px 0; color: rgb(97, 97, 97);">
            <span style="margin: 5px;"><strong><i class="fa-solid fa-bed fa-xl"></i></strong></span> <span style="margin: 5px;">${listing.bedrooms}</span>
            <span style="margin: 5px;"><strong><i class="fa-solid fa-bath fa-xl"></i></strong></span><span style="margin: 5px;">${listing.baths}</span>
          </div>
        </div>
      `;

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

//document.getElementById("emailForm").addEventListener("submit", async (e) => {
//  e.preventDefault();
//  const message = document.getElementById("message").value;
//
//  try {
//    await fetch("https://www.upstatekosherrentals.com/email", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({
//        to: "upstatekosherrentals@gmail.com",
//        subject: "Suggestion from Site",
//        message,
//      }),
//    });
//    alert("Thanks for Emailing us!");
//    document.getElementById("message").value = "";
//  } catch (err) {
//    alert("Failed to send email");
//    console.error(err);
//  }
//});


//async function populateCities() {
//
//  const res = await fetch('http://localhost:3000/search');
//  const data = await res.json();
//  
//  const excludedCities = ['Brooklyn', 'New York', 'Somerset'];
//  const cities = data.filter(city => !excludedCities.includes(city));
//
//  console.log(cities)
//
//  const select = document.getElementById('area-select')
//
//  cities.forEach(city => {
//    const option = document.createElement('option');
//    option.value = city;
//    option.textContent = city;
//    select.appendChild(option)
//  })
//  
//}
//
//populateCities();