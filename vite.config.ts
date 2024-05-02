import { defineConfig, loadEnv, UserConfigExport, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';

// This is a TypeScript Vite Config file.
// Comments are retained from both original configurations for clarity.
export default ({ mode }: ConfigEnv): UserConfigExport => {
  // Load environment variables and merge them with process.env
  // You can access Vite specific env variables here like VITE_NAME using process.env.VITE_NAME
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()], // Using React plugin from Vite

    build: {
      chunkSizeWarningLimit: 2000, // Control the size before showing a warning for chunk size
      outDir: 'dist', // Specify your desired output directory
      rollupOptions: {
        output: {
          manualChunks: {
            lodash: ['lodash'], // Manually define chunk for lodash
            vendor: ['react', 'react-dom'], // Manually define chunk for React and ReactDOM
          },
        },
      },
    },

    server: {
      port: parseInt(process.env.VITE_PORT || '5173'), // Use VITE_PORT from .env.local, default to 5173
      open: true, // Automatically open the default browser when starting the server
    },
  });
};
