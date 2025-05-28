console.log('Script loaded');

const listingForm = document.getElementById("listing-form");

listingForm.addEventListener("submit", async (e) => {
  
  e.preventDefault();
  console.log('Submit event triggered');

  const formData = new FormData(e.target);
  const fileInput = document.getElementById("formFileMultiple");
  const files = fileInput.files;

  for (const file of files) {
    try {
      const resizedBlob = await resizeImage(file, 300, 300);
      formData.append("files", resizedBlob, file.name);
      console.log(`Resized and appended "${file.name}" - size: ${resizedBlob.size} bytes`);
    } catch (err) {
      console.error(`Error resizing image "${file.name}":`, err);
      formData.append("files", file, file.name);
      console.log(`Appended original file "${file.name}" - size: ${file.size} bytes`);
    }
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
        let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        let width = img.width * ratio;
        let height = img.height * ratio;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas is empty"));
            }
          },
          "image/jpeg",
          0.7
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}