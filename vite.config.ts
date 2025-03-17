import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

export default defineConfig({
    build: {
        outDir: 'dist', // Output to dist folder
        rollupOptions: {
            input: {
                background: path.resolve(__dirname, 'src/background.ts'),
                content: path.resolve(__dirname, 'src/content.ts'),
                popup: path.resolve(__dirname, 'src/popup.ts'),
            },
            output: {
                entryFileNames: '[name].js', // Output file names
            },
        },
    },
    plugins: [
        {
            name: 'copy-manifest',
            writeBundle() {
                // Copy manifest.json to the dist folder
                const manifestPath = path.resolve(__dirname, 'manifest.json')
                const distManifestPath = path.resolve(__dirname, 'dist', 'manifest.json')

                if (fs.existsSync(manifestPath)) {
                    fs.copyFileSync(manifestPath, distManifestPath)
                } else {
                    console.error('Manifest file not found!')
                }
            },
        },
    ],
})
