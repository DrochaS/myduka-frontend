import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  // Vitest still transforms via esbuild; keep automatic JSX so components
  // do not need a classic `import React` in every file.
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('chart.js') ||
              id.includes('react-chartjs-2') ||
              id.includes('@kurkle/color')
            ) {
              return 'vendor-charts'
            }
            if (
              id.includes('@reduxjs/toolkit') ||
              id.includes('react-redux') ||
              id.includes('redux')
            ) {
              return 'vendor-redux'
            }
            if (
              id.includes('react-router') ||
              id.includes('@remix-run')
            ) {
              return 'vendor-router'
            }
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('scheduler')
            ) {
              return 'vendor-react'
            }
            if (id.includes('axios')) {
              return 'vendor-axios'
            }
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js',
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', 'export/**', 'docs/**'],
  },
})
