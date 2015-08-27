var webpack = require('webpack'),
    webpackConfig = require('webpack-config');

module.exports = webpackConfig.fromCwd().merge({
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
});
