// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
   runtimeConfig: {
        public: {
            supabase: {key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3VxcWp2Z3J6eXN6dnlvdWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjE5MzksImV4cCI6MjA5MjUzNzkzOX0.bXqbrI9FtP360_QV3CyTMgWFbCrgRACJYr38mKp1hg8",
              url: "https://tyouqqjvgrzyszvyouhi.supabase.co"
            },
        }
    }
})
