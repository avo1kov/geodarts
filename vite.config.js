import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import legacy from "@vitejs/plugin-legacy"
import viteCompression from "vite-plugin-compression"
import { visualizer } from "rollup-plugin-visualizer"

// const outputPath = path.resolve("./public/")
const PRODUCTION = process.env.NODE_ENV === "production"
const indexHtmlPath = PRODUCTION ? "src/index-prod.html" : "src/index-dev.html"
console.log("MOD PRODUCTION=", PRODUCTION, "indexHtmlPath=", indexHtmlPath)

export default defineConfig({
    root: "src",
    base: PRODUCTION ? "/geodarts/" : "/",
    build: {
        outDir: "../dist",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0]
                    }
                },
            },
        },
    },
    plugins: [
        react(), // Handles React fast refresh
        PRODUCTION && legacy({
            targets: ["defaults", "not IE 11"],
        }),
        viteCompression({
            algorithm: "gzip",
            threshold: 10240,
            minRatio: 0.8,
        }),
        visualizer({ open: true }) // Equivalent to webpack-bundle-analyzer
    ].filter(Boolean),

    // build: {
    //     rollupOptions: {
    //         input: "src/index.tsx",
    //         output: {
    //             entryFileNames: PRODUCTION ? "[name]-[hash].js" : "main.js",
    //             assetFileNames: "assets/[name]-[hash].[ext]",
    //             manualChunks(id) {
    //                 if (id.includes("node_modules")) {
    //                     return "vendor"
    //                 }
    //             }
    //         }
    //     },
    //     sourcemap: PRODUCTION ? "source-map" : "inline",
    //     minify: PRODUCTION ? "terser" : false,
    // },

    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             // If you need global variables or mixins in SCSS
    //             additionalData: "@import \"./src/styles/variables.scss\";"
    //         }
    //     }
    // },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"), // Alias for src
        },
        // extensions: [".js", ".ts", ".jsx", ".tsx"]
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
})
