// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      input: {

}, },
}, server: {
open: true,
    port: 5173,
  },
});