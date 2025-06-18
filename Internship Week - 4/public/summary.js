// summary.js

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('bookingTableBody');

  fetch('/api/bookings')
    .then(response => response.json())
    .then(bookings => {
      bookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${booking.name}</td>
          <td>${booking.email}</td>
          <td>${booking.room}</td>
          <td>${booking.date}</td>
          <td>${booking.time}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching bookings:', error);
      const errorRow = document.createElement('tr');
      errorRow.innerHTML = `<td colspan="6" style="color:red;">Failed to load bookings</td>`;
      tableBody.appendChild(errorRow);
    });
});
