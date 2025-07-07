const signInForm = document.getElementById('signInForm');


signInForm.addEventListener('submit', async (e) => {
e.preventDefault()

let signInFormData = new FormData(signInForm);


const signInDataToBackend = {
    email : signInFormData.get('email'),
    password : signInFormData.get('password')
}

try {

    const signInRes = await fetch('/auth',{
        method : 'POST',
         headers: {
         "Content-Type": "application/json",
     }, body: JSON.stringify(signInDataToBackend),
    })

     const data = await signInRes.json();

    if (signInRes.ok) {
      alert("You Where authenticate");
      localStorage.setItem("loggedInEmail", signInDataToBackend.email);
      signInForm.reset();
      window.location.href = 'add-listing.html';
    } else {
      alert("Error: " + (data.message || "Something went wrong."));
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Network error. Please try again.");
  }
});

    
