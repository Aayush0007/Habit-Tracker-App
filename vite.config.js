import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'Logo.png'],
      manifest: {
        name: 'Warrior Mode: 2026 Aspirant Tracker',
        short_name: 'Warrior',
        description: 'High-performance study and habit tracker for competitive exams.',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone', // Critical for "Install" prompt
        orientation: 'portrait',
        icons: [
          {
            src: 'Logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      devOptions: {
        enabled: true // Allows you to test PWA features on localhost
      }
    })
  ],
  server: {
    // FIX: Solves the WebSocket Connection Error
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    watch: {
      usePolling: true, // Use this if you are on a VM or Docker
    }
  }
});