var moment = require('moment'),
    pkg = require('./package.json'),
    webpack = require('webpack');

module.exports = {
    entry: {
        src: './src/videojs-concurrency.js'
    },

    output: {
        filename: 'videojs.concurrency.js',
        path: 'dist'
    },

    module: {
        preLoaders: [{
            exclude: /node_modules/,
            loader:  'eslint-loader',
            test:    /\.js$/
        }],

        loaders: [{
            exclude: /node_modules/,
            loader: 'babel-loader',
            test: /\.js$/
        }]
    },

    plugins: [
        new webpack.BannerPlugin([
            '/**',
            ' * ' + pkg.name + ' v' + pkg.version,
            ' * ',
            ' * @author: ' + pkg.author,
            ' * @date: ' + moment().format('YYYY-MM-DD'),
            ' */',
            ''
        ].join('\n'), {
            raw: true
        })
    ],

    externals: {
        videojs: 'video.js'
    }
};
