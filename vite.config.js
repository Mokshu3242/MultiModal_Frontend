import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Set up alias for src directory
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Optional: specify a port (default is 5173)
  },
});