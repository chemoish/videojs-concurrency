var webpack = require('webpack'),
    webpackConfig = require('webpack-config');

module.exports = webpackConfig.fromCwd().merge({
    devServer: {
        colors:             true,
        contentBase:        './example',
        historyApiFallback: true,
        inline:             true,
        progress:           true
    },

    devtool: 'eval-source-map'
});
