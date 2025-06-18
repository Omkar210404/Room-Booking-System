const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rakmomakin@gmail.com',
    pass: 'ttkhwgstjpahvoxa', // Replace with real app password
  },
});

// POST booking
app.post('/api/book', (req, res) => {
  const booking = req.body;
  console.log("📨 Booking received:", booking);

  if (!booking.email || !booking.name) {
    return res.status(400).json({ error: "Missing email or name." });
  }

  fs.readFile('bookings.json', (err, data) => {
    let bookings = [];
    if (!err) {
      try {
        bookings = JSON.parse(data);
      } catch {}
    }

    bookings.push(booking);

    fs.writeFile('bookings.json', JSON.stringify(bookings, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving booking." });

      // HTML Email Template
      const mailOptions = {
        from: 'rakmomakin@gmail.com',
        to: booking.email,
        subject: '✅ Your Room Booking is Confirmed!',
        html: `
          <div style="font-family:sans-serif;padding:10px">
            <h2 style="color:#008080;">Hello ${booking.name},</h2>
            <p>🎉 Your room booking is successfully confirmed!</p>
            <table border="1" cellpadding="10" style="border-collapse: collapse;">
              <tr><th>Room</th><td>${booking.room}</td></tr>
              <tr><th>Date</th><td>${booking.date}</td></tr>
              <tr><th>Time</th><td>${booking.time}</td></tr>
            </table>
            <p style="margin-top:10px;">Thanks for using <strong>SISPL Room Booking System</strong>.</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("❌ Error sending email:", error);
          return res.status(500).json({ error: "Email failed." });
        }
        console.log("✅ Email sent:", info.response);
        res.json({ message: "Booking successful and email sent." });
      });
    });
  });
});

// GET all bookings (Admin View)
app.get('/api/bookings', (req, res) => {
  fs.readFile('bookings.json', (err, data) => {
    if (err) return res.status(500).json({ error: "Cannot read booking data." });

    try {
      const bookings = JSON.parse(data);
      res.json(bookings);
    } catch {
      res.status(500).json({ error: "Corrupt booking file." });
    }
  });
});

// Serve summary.html
app.get('/summary', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'summary.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
