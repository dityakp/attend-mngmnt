const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env

const app = express(); // Initialize the Express app

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Test route to check server status
app.get('/', (req, res) => {
  res.send('Hello! Server is running.');
});

// Import and use your API route files
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Start the server on the port from .env or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
