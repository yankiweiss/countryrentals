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