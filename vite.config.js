import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Reached through a tunnel (trycloudflare), so every host is allowed.
const server = { host: true, port: Number(process.env.PORT) || 5173, strictPort: true, allowedHosts: true };

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server,
  preview: server,
});
