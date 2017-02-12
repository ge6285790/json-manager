import express from 'express';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.dev.config';

const compiler = webpack(config);
const app = express();

const PORT = process.env.PORT || 8000;

app.use(WebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: { color: true },
}));

app.use(WebpackHotMiddleware(compiler));

app.use('/assets', express.static(__dirname + '/../public'));

// app.get('/', (req, res) => {
//   // console.log('aaaa');
//   res.send(req);
// });

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
