const listingForm = document.getElementById("listing-form");

listingForm.addEventListener('submit', handleForm);

function handleForm (e){
    e.preventDefault();

   const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries())

    fetch('https://countryrentals.vercel.app/listing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // convert JS object to JSON string
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to submit listing');
      return response.json();
    })
    .then(result => {
      console.log('Listing submitted:', result);
      alert('Listing successfully submitted!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error submitting listing');
    });
}


