 document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  await fetch("https://countryrentals.vercel.app/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "yakovw2706@gmail.com", // ✅ Use key-value
      subject,
      message,
    }),
  });
});