import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        minify: 'terser',
        cssMinify: true
    },
    server: {
        port: 5173,
        open: true
    }
})
