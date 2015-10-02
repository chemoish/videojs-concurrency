var Clean             = require('clean-webpack-plugin'),
    webpack           = require('webpack'),
    webpackConfig     = require('webpack-config');

var config = webpackConfig.fromCwd().merge({
    output: {
        filename: 'videojs.concurrency.min.js'
    }
});

config.plugins = [
    new Clean([
        'build'
    ]),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
];

module.exports = config;
