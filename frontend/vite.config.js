import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
     VitePWA({
      registerType:
        "autoUpdate",
      manifest: {
        name:
          "FamilyGram",
        short_name:
          "FamilyGram",
        description:
          "A private family social media app",
        theme_color:
          "#09090B",
        background_color:
          "#09090B",
        display:
          "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons8-smile-100 (1).png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons8-smile-100 (2).png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  define: {
    "process.env": {}
  },
})
