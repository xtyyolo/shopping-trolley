import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', 
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist', 
    assetsDir: 'assets', 
    minify: 'terser', 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        plugins: [],
      },
    },
  },
});
