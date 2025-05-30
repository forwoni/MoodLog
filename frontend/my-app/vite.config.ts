import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ⬅️ 추가!

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ⬅️ alias 추가!
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // ← 백엔드 주소
        changeOrigin: true,
      },
    },
  },
});
