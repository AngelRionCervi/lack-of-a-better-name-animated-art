const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "js/bundle.js",
    },
    devServer: {
        port: 8088,
        contentBase: path.join(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: "./dist/index.html",
        }),
    ],
};
