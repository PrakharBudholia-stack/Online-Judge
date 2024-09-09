import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5123,  // Default port, can be changed if needed
    host:true,
    open: true,  // Automatically opens the browser when the server starts
  },
  resolve: {
    alias: {
      '@': '/src',  // Alias for the src directory (optional, but useful for cleaner imports)
    },
  },
  build: {
    outDir: 'dist',  // Output directory for the production build
  },
});
