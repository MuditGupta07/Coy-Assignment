import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The frontend calls /api/*; Vite forwards it to Express (stripping the /api prefix),
// so the browser only ever talks to one origin and CORS never comes into play.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
