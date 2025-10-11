import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My React App',
        short_name: 'MyApp',
        description: 'A React PWA built with Vite',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '.', // relative start URL for PWA
        scope: '.',     // ensures all routes fall under PWA
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,      // automatically clean old caches
        navigateFallback: '/index.html',  // fixes blank home page in installed PWA
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: '/index.html', // entry point
    },
  },
  base: './', // relative base for installed PWA
  server: {
    hmr: {
      overlay: false, // disables HMR overlay for URI decode errors
    },
  },
})
