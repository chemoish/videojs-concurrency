var webpack = require('webpack');

module.exports = {
    entry: {
        src: './src/concurrency.js'
    },

    output: {
        filename: 'videojs.concurrency.js',
        path: 'dist'
    },

    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.js$/
        }]
    }
};
