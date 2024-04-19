// Importing necessary modules
import express from 'express';
import path from 'path';
import os from 'os';
import 'dotenv/config'; // Load environment variables from .env


// Initialize Express app
const app = express();

// Configuration settings
const PORT = process.env.VITE_PORT || 5173; // get VITE_PORT value from .env
const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

// Middleware to serve static files from DIST_DIR
app.use(express.static(DIST_DIR));

// Fallback route for SPA handling, serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(INDEX_FILE, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      return res
        .status(500)
        .send('An error occurred while serving the application');
    }
  });
});

// Function to get the first non-internal IPv4 address
function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const networkInterface of Object.values(networkInterfaces)) {
    const found = networkInterface?.find(
      (net) => net.family === 'IPv4' && !net.internal,
    );
    if (found) return found.address;
  }
  return 'localhost';
}

// Start the Express server
app.listen(PORT, () => {
  const ipAddress = getLocalIpAddress();
  console.log(
    `Server is running at:\n- Localhost: http://localhost:${PORT}\n- Local IP: http://${ipAddress}:${PORT}`,
  );
});
