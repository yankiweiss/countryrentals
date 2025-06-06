const listingSection = document.getElementById('listings')

fetch("https://countryrentals.vercel.app/listing")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    displayHomeListings(data);
  });

function displayHomeListings(listings) {
  listings.forEach((listing) => {
    const div = document.createElement("div");
    div.className = "listing";
    div.innerHTML = `
      <img src="${listing.uploadedFiles[0]}" width="250" style="margin: 5px;" />
        <h5>${listing.address}</h5>`;
    listingSection.appendChild(div);
  });
}

document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;

  await fetch("https://countryrentals.vercel.app/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "upstatekosherrentals@gmail.com", // ✅ Use key-value
      subject: "Suggestion from Site",
      message,
    }),
  });
  alert("Thanks for Emailing us!");
  document.getElementById("message").value = "";
});
