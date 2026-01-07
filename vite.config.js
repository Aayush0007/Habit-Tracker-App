import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Warrior Mode 2026',
        short_name: 'Warrior',
        theme_color: '#020617',
        icons: [
          { src: 'favicon.ico', sizes: '64x64', type: 'image/x-icon' }
        ]
      }
    })
  ]
});