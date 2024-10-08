import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import viteCompression from "vite-plugin-compression"
import { ViteEjsPlugin } from "vite-plugin-ejs"
// import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig(({ mode }) => {
    const __production__ = mode === "production"

    return {
        root: "src",
        build: {
            outDir: "../dist",
        },
        plugins: [
            react(), // Handles React fast refresh
            ViteEjsPlugin({
                __production__
            }),
            __production__ && viteCompression({
                algorithm: "gzip",
                threshold: 10240,
                minRatio: 0.8,
            }),
            // visualizer({ open: true }) // Equivalent to webpack-bundle-analyzer
        ].filter(Boolean),

        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"), // Alias for src
            },
        },

        server: {
            host: "0.0.0.0",
            port: 3000,
            open: true,
            hmr: true,
        },

        preview: {
            host: "0.0.0.0",
            port: 3001,
            strictPort: true
        }
    }
})
