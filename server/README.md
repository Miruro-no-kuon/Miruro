# Server README

This README provides an overview of the `server.js` file, which is an Express server designed to serve static files, handle error logging, and provide instructions for running it using the Bun JavaScript runtime.

## `server.js` Overview ℹ️

The `server.js` file includes the following features:

- Express server setup
- Static file serving to serve files from the `dist` directory 📂
- Error logging for server-side errors 📝

## Installation and Running 🛠️

To run the server, follow these steps:

1. Clone this repository to your local machine 📦

2. Install project dependencies:

   ```bash
   bun install
   ```

3. Start the server:

   ```bash
   bun run server.js
   ```

- The server will start running on <http://localhost:5173> by default. You can modify the `PORT` variable in `server.js` to change the port as needed.
