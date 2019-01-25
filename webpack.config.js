var path = require('path');
var MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new MinifyPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    "postcss-loader"
                ]
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    }
};
