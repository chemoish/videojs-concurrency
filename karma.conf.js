module.exports = (config) => {
  config.set({
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    files: [{
      pattern: 'test/tests.webpack.js',
      watched: false,
    }],

    preprocessors: {
      'test/tests.webpack.js': ['webpack'],
    },

    webpack: {
      module: {
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
    },

    webpackMiddleware: {
      noInfo: true,
    },
  });
};
