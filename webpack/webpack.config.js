const moment = require('moment');
const pkg = require('../package.json');
const webpack = require('webpack');

module.exports = {
  entry: {
    'videojs.concurrency': './src/videojs-concurrency.js',
  },

  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    path: 'dist',
  },

  module: {
    preLoaders: [{
      exclude: /node_modules/,
      loader: 'eslint',
      test: /\.js$/,
    }],

    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      test: /.js$/,

      query: {
        presets: [
          'es2015',
        ],

        plugins: [
          'transform-object-rest-spread',
          'transform-runtime',
        ],
      },
    }],
  },

  plugins: [
    new webpack.BannerPlugin([
      '/**',
      ` * ${pkg.name} v${pkg.version}`,
      ' * ',
      ` * @author: ${pkg.author}`,
      ` * @date: ${moment().format('YYYY-MM-DD')}`,
      ' */',
      '',
    ].join('\n'), {
      raw: true,
    }),
  ],

  externals: {
    'video.js': 'videojs',
  },
};
