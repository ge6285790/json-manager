// import express from 'express';
// import webpack from 'webpack';
// import WebpackDevMiddleware from 'webpack-dev-middleware';
// import WebpackHotMiddleware from 'webpack-hot-middleware';
// import cool from 'cool-ascii-faces';
// import config from '../webpack.dev.config';
//
//
// const compiler = webpack(config);
// const app = express();
//
// const PORT = process.env.PORT || 8000;
//
// app.use(WebpackDevMiddleware(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
//   stats: { color: true },
// }));
//
// app.use(WebpackHotMiddleware(compiler));
//
// app.use('/assets', express.static(__dirname + '/../public'));
//
// app.get('/cool', (req, res) => {
//   // console.log('aaaa');
//   res.send(cool());
// });
//
// app.listen(PORT, () => {
//   console.log(`Listening on ${PORT}`);
// });

var express = require('express');

var cool = require('cool-ascii-faces');




var app = express();

if (process.env.NODE_ENV === 'development') {
  var webpack = require('webpack');
  var WebpackDevMiddleware = require('webpack-dev-middleware');
  var WebpackHotMiddleware = require('webpack-hot-middleware');
  var config = require('../webpack.dev.config');
  var compiler = webpack(config);
  app.use(WebpackHotMiddleware(compiler));
  app.use(WebpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: { color: true },
  }));
}

var PORT = process.env.PORT || 8000;





app.use('/assets', express.static(__dirname + '/../public/assets'));

app.get('/cool', (req, res) => {
  // console.log('aaaa');
  res.send(cool());
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
