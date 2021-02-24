const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');

const runServer = () => new Promise((resolve, reject) => {
  const compiler = webpack({
    ...config(undefined, { mode: 'development' }),
    mode: 'development',
    stats: 'minimal',
  });

  const server = new WebpackDevServer(
    compiler,
    { noInfo: true, clientLogLevel: 'silent' },
  );

  server.listen(9000, 'localhost', (err) => (err ? reject(err) : resolve(server)));
});

module.exports = runServer;
