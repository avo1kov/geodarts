import path from "node:path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

const outputPath = path.resolve("./public/")

export default (env, argv) => {
    const PRODUCTION = typeof argv !== "undefined" ? argv.mode === "production" : true

    return {
        entry: "./src/index.tsx",
        output: {
            filename: "main.js",
            publicPath: "/",
            path: outputPath,
            clean: true
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            extensionAlias: {
                ".js": [".js", "ts"],
                ".cjs": [".cjs", ".cts"],
                ".mjs": [".mjs", ".mts"]
            }
        },
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
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: "[path][name]__[local]--[hash:base64:5]",
                                    getLocalIdent: (context, localIdentName, localName, options) => {
                                        if (/^map/.test(localName)) {
                                            return localName
                                        }

                                        const hash = Math.random().toString(36).slice(9)

                                        return `${localName}_${hash}`
                                    }
                                }
                            }
                        },
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader",
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: "file-loader",
                        },
                    ],
                }
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(process.cwd(), "src/index.html")
            }),
            PRODUCTION && new MiniCssExtractPlugin({
                filename: "css/[name]_[contenthash:8].css",
                chunkFilename: "chunk_[id].css"
            })
        ].filter(Boolean),
        devServer: {
            host: "0.0.0.0",
            static: outputPath,
            historyApiFallback: true,
            allowedHosts: "all"
        },
    }
}
