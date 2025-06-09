const listingSection = document.getElementById('listings');

async function fetchListings() {
  try {
    const res = await fetch("https://countryrentals.vercel.app/listing");
    const data = await res.json();
    console.log(data);
    displayHomeListings(data);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

async function displayHomeListings(listings) {
  for (const listing of listings) {
    const link = document.createElement("a");
    link.href = `listing.html?id=${listing._id}`;
    link.style.textDecoration = "none";
    link.style.color = "inherit";
    link.style.display = "block"; // Ensures full card is clickable

    const div = document.createElement("div");
    div.className = "listing";

    const image = new Image();
    image.src = listing.uploadedFiles[0];
    image.width = 250;
    image.style.margin = "5px";

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => {
        console.warn("Image failed to load:", image.src);
        resolve();
      };
    });

    const content = `
      <h5 style="text-align: center;">${listing.street}</h5>
      <h5 style="text-align: center;">
        <strong><i>Bedrooms:</i></strong> ${listing.bedrooms}
        <span style="margin-left: 10px;">
          <strong><i>Baths:</i></strong> ${listing.baths}
        </span>
      </h5>
    `;

    div.appendChild(image);
    div.insertAdjacentHTML("beforeend", content);

    link.appendChild(div);
    listingSection.appendChild(link);
  }
}

fetchListings();

document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;

  try {
    await fetch("https://countryrentals.vercel.app/email", {
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