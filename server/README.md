# Server README

This README provides an overview of the `server.js` file, which is an Express server designed to serve as a proxy for fetching various types of data, handling static file serving, error logging, and providing instructions for running it using the Bun JavaScript runtime.

## `server.js` Overview ℹ️

The `server.js` file includes the following features:

- Express server setup
- CORS (Cross-Origin Resource Sharing) middleware for enabling cross-origin requests 🌐
- Static file serving to serve files from the `dist` directory 📂
- Logging using Winston, which provides colored log messages for different log levels (error, warning, info) 📝
- Proxy functionality to fetch data from external URLs and respond with the appropriate content type 🔄
- Error handling for failed fetch requests and missing URL query parameters ❌

## Installation and Running 🛠️

To install dependencies and run the server, you can use the Bun JavaScript runtime. Here are the steps:

1. Clone this repository to your local machine 📦

2. Install project dependencies:

   ```bash
   bun install
   ```

3. Start the server:
  
   ```bash
   bun run server.js
   ```

- The server will start running on <http://localhost:5173> by default, but you can modify the PORT variable in server.js to change the port as needed.
