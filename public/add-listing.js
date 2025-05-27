const listingForm = document.getElementById("listing-form");

listingForm.addEventListener('submit', handleForm);

function handleForm (e){
    e.preventDefault();

   const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries())

    console.log(data)

}
