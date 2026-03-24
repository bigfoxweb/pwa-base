import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    base: '/',

    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      'import.meta.env.VITE_BUILD_DATE': JSON.stringify(
        new Date().toLocaleDateString('pt-BR')
      ),

      __FIREBASE_API_KEY__: JSON.stringify(env.VITE_FIREBASE_API_KEY),
      __FIREBASE_AUTH_DOMAIN__: JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      __FIREBASE_PROJECT_ID__: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      __FIREBASE_STORAGE_BUCKET__: JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      __FIREBASE_MESSAGING_SENDER_ID__: JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      __FIREBASE_APP_ID__: JSON.stringify(env.VITE_FIREBASE_APP_ID),
    },

    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000/pwa-base',
          changeOrigin: true,
        },
      },
    },

    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',
      }),
    ],
  }
})