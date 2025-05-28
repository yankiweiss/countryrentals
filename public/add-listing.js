const listingForm = document.getElementById("listing-form");

listingForm.addEventListener("submit", handleForm);

function handleForm(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const myFiles = document.getElementById("formFileMultiple").files;
  console.log(myFiles)
  Array.from(myFiles).forEach((file) => {
    formData.append("files", file); // Use the same key for multiple files
  });

  for (let pair of formData.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}

  fetch("https://countryrentals.vercel.app/listing", {
    method: "POST",
    body: formData, // No need to set headers for FormData
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to submit listing");
      return response.json();
    })
    .then((result) => {
      console.log("Listing submitted:", result);
      alert("Listing successfully submitted!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error submitting listing");
    });
}