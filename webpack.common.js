const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: {
        app: path.resolve('./src/app/Main.ts'),
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].bundle.js",
        sourceMapFilename: "[name].bundle.map",
        publicPath: ''
    },

    module: {
        rules: [
            {
                //enforce: "pre",
                test: /\.tsx?$/,
                exclude: ["node_modules"],
                use: [
                    {
                        loader: "ts-loader", 
                        options: { transpileOnly: true }
                    },
                    "source-map-loader"
                ]
            },

            { test: /\.html$/, loader: "html-loader" },
            { test: /\.scss$/,loaders: ["style-loader", "css-loader","fast-sass-loader"] },
            { test: /\.(glsl|vs|fs)$/, loader: 'ts-shader-loader'},
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "actions": path.resolve(__dirname, "src/app/worker/actions/"), 
            "dom": path.resolve(__dirname, "src/app/main/dom/"), 
            "frp": path.resolve(__dirname, "src/app/worker/frp/"), 
            "types": path.resolve(__dirname, "src/app/types/"), 
            "utils": path.resolve(__dirname, "src/app/utils/"), 
        }
    },
    plugins: [

        new CleanWebpackPlugin(['dist']),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/webpage/index.html'),
            hash: true,
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env['NODE_ENV']),
                'BROADCAST': JSON.stringify(process.env['BROADCAST']),
                'BUILD_VERSION': JSON.stringify(require("./package.json").version)
            }
        }),
        new ForkTsCheckerWebpackPlugin()
    ],


};
