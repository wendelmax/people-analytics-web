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
    'import.meta.env.VITE_USE_MOCK': JSON.stringify(process.env.VITE_USE_MOCK || 'true'),
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
    'import.meta.env.VITE_MOCK_API_URL': JSON.stringify(process.env.VITE_MOCK_API_URL || 'http://localhost:3001'),
    'import.meta.env.VITE_API_TIMEOUT': JSON.stringify(process.env.VITE_API_TIMEOUT || '30000'),
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignora todos os warnings durante o build
        return;
      },
    },
  },
  esbuild: {
    // Ignora erros de TypeScript durante o build
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  // Desabilita verificação de tipos durante o build
  optimizeDeps: {
    esbuildOptions: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
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

