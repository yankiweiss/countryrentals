const listingForm = document.getElementById("listing-form");

listingForm.addEventListener("submit", handleForm);

function handleForm(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const myFiles = document.getElementById("formFileMultiple").files;
  Array.from(myFiles).forEach((file) => {
    formData.append("files", file); // Use the same field name "files" for multiple files
  });

  fetch("https://countryrentals.vercel.app/listing", {
    method: "POST",
    body: formData,  // Do NOT set Content-Type here! Let browser set it (with boundary)
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
    console.error("Error submitting listing:", error);
    alert("Error submitting listing");
  });
}