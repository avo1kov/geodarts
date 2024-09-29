import path from "node:path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import CompressionPlugin from "compression-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

const outputPath = path.resolve("./public/")

export default (env, argv) => {
    const PRODUCTION = typeof argv !== "undefined" ? argv.mode === "production" : true
    const indexHtmlPath = PRODUCTION ? "src/index-prod.html" : "src/index-dev.html"
    console.log("MOD PRODUCTION=", PRODUCTION, "indexHtmlPath=", indexHtmlPath)

    return {
        output: {
            filename: PRODUCTION ? "[name]-[contenthash].bundle.js" : "main.js",
            publicPath: PRODUCTION ? "/geodarts/" : "/",
            path: outputPath,
            clean: true,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            extensionAlias: {
                ".js": [".js", ".ts"],
                ".cjs": [".cjs", ".cts"],
                ".mjs": [".mjs", ".mts"]
            }
        },
        devtool: PRODUCTION ? "source-map" : "eval-source-map",
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader"
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: "asset/resource",
                },
            ],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                },
            },
            minimize: PRODUCTION,
            minimizer: [new TerserPlugin()],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CompressionPlugin({
                algorithm: "gzip",
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8,
            }),
            new HtmlWebpackPlugin({
                template: path.join(process.cwd(), indexHtmlPath)
            }),
            PRODUCTION && new MiniCssExtractPlugin({
                filename: "css/[name]_[contenthash:8].css",
                chunkFilename: "css/[id]_[contenthash:8].css"
            }),
            new BundleAnalyzerPlugin(),
        ].filter(Boolean),
        devServer: {
            host: "0.0.0.0",
            static: {
                directory: outputPath,
            },
            historyApiFallback: true,
            allowedHosts: "all",
            hot: true,
        },
    }
}
