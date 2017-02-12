var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var autoprefixer = require('autoprefixer');
var flexibility = require('postcss-flexibility');
var WebpackStrip = require('webpack-strip');

module.exports = {
  entry: [
    'babel-polyfill',
    `${path.resolve(__dirname, 'src')}/app`,
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '/asset/js/bundle/bundle.min.js',
    chunkFilename: '/asset/js/bundle/chunk.[name].min.js',
  },
  module:
  {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        query:
        {
          presets: ['es2015', 'stage-0', 'react'],
          // plugins: ['transform-decorators-legacy'],
        },
      },
      {
        test: /\.json?$/,
        loader: 'json-loader',
      },
      {
        test: /\.css|\.scss$/,
        loaders: [
          'style',
          'css',
          'sass?outputStyle=expanded&includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib'),
          'postcss',
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/i,
        loader: 'url-loader?limit=8192&name=../public/img/[name].[ext]',
      },
      {
        test: /\.js$/,
        loader: WebpackStrip.loader('debug', 'console.log'),
      },
    ],
  },
  postcss: [
    autoprefixer,
    flexibility,
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    new ExtractTextPlugin('./asset/css/bundle/bundle.min.css'),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
  ],
};
