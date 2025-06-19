window.onload = () => {
  launchConfetti();
  
};

function launchConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  });
}


const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("listingId");

if (listingId) {
  console.log("Listing ID from Stripe success redirect:", listingId);
  
}