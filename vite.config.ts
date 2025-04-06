import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Book Worm",
        short_name: "Book Worm",
        description: "Offline first book reader with dictionary support",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cacheId: "bw-resources",
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            // Match all /books/get/whatever paths
            urlPattern: /\/books\/get\/.*/,
            handler: "CacheOnly",
            options: {
              cacheName: "bw-resources",
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
  ],
  server: {
    proxy: {
      '/books/get': {
        bypass: (req) => {
          // If the request is for a cached resource, let the browser handle it
          if (req.headers.accept && req.headers.accept.includes('image') || req.headers.accept === 'application/pdf') {
            return; // Don't bypass, let the browser fetch (which will hit the SW)
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
