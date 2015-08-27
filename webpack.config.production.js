var webpack = require('webpack'),
    webpackConfig = require('webpack-config');

module.exports = webpackConfig.fromCwd().merge({
    output: {
        filename: 'videojs.concurrency.min.js',
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
});
