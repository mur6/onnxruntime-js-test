// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, 'main.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.min.js'
    },
    plugins: [
        new CopyPlugin({
            // Use copy plugin to copy *.wasm to output folder.
            patterns: [{ from: 'node_modules/onnxruntime-web/dist/*.wasm', to: '[name][ext]' }]
        }),
        new webpack.SourceMapDevToolPlugin({})
    ],
    mode: "development",
    devtool: 'source-map'
}

