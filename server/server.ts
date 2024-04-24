import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import os from 'os';
import bodyParser from 'body-parser';
import 'dotenv/config'; // Load environment variables from .env

const app = express();

// Configuration settings
const PORT = process.env.VITE_PORT || 5173;
const CLIENT_ID = process.env.VITE_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = process.env.VITE_REDIRECT_URI;
const PLATFORM = import.meta.env.VITE_DEPLOY_PLATFORM; // This will be set as 'VERCEL' or 'CLOUDFLARE'
const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

app.use(express.static(DIST_DIR));
app.use(bodyParser.json());
app.use(express.json());

// Determine the endpoint based on the platform
const apiEndpoint =
  PLATFORM === 'VERCEL' ? '/api/exchange-token' : '/api/exchange-token';

app.post(apiEndpoint, async (req, res) => {
  const { code } = req.body;
  if (!code) {
    console.error('Authorization code is missing');
    return res.status(400).send('Authorization code is required');
  }

  const payload = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  };

  const url = 'https://anilist.co/api/v2/oauth/token';

  //console.log('Sending request to AniList API');
  //console.log('URL:', url);
  //console.log('Payload:', payload);

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity', // This tells the server to send non-compressed responses
      },
    });

    //console.log('Received response from AniList API');
    //console.log('Response Status:', response.status);
    //console.log('Response Data:', response.data);

    if (response.data.access_token) {
      res.json({ accessToken: response.data.access_token });
    } else {
      throw new Error('Access token not found in the response');
    }
  } catch (error) {
    console.error('Error during token exchange:', error.message);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Details:', error.response.data);
    }
    res.status(500).json({
      error: 'Failed to exchange token',
      details: error.response?.data || error.message,
    });
  }
});

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
