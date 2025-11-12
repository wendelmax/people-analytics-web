import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_USE_MOCK': JSON.stringify('true'),
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000'),
    'import.meta.env.VITE_MOCK_API_URL': JSON.stringify('http://localhost:3001'),
    'import.meta.env.VITE_API_TIMEOUT': JSON.stringify('30000'),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

