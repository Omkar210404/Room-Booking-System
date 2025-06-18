document.getElementById('bookingForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const booking = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    room: document.getElementById('room').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
  };

  fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        showPopup();
        document.getElementById('bookingForm').reset();
      } else {
        alert("Booking failed: " + (data.error || "Unknown error"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong!");
    });
});

function showPopup() {
  document.getElementById('successPopup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('successPopup').style.display = 'none';
}
