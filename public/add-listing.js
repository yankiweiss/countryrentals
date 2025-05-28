const listingForm = document.getElementById("listing-form");

listingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const fileInput = document.getElementById("formFileMultiple");
  const files = fileInput.files;

  for (const file of files) {
    const resizedBlob = await resizeImage(file, 300, 300);
    formData.append("files", resizedBlob, file.name);
  }

  fetch("https://countryrentals.vercel.app/listing", {
    method: "POST",
    body: formData,
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
});

function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type);
      };

      img.onerror = (err) => reject(err);
    };
  });
}