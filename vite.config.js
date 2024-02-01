import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    // You can customize the output directory and publicPath if needed
    outDir: "dist", // Specify your desired output directory
    publicDir: "public", // Specify your public directory
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ["lodash"],
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    // You can customize the development server options here
    port: 5173, // Specify the port you want to use
    open: true, // Automatically open the default browser when starting the development server
  },
});
