const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

let domain = process.env.PRODUCTION_DOMAIN;
// guard against values like undefined, 'undefined', null, or empty string
if (!domain || domain === 'undefined' || domain === 'null') {
  domain = 'http://localhost:8081';
}
// ensure protocol
if (!/^https?:\/\//i.test(domain)) {
  domain = `http://${domain}`;
}
// remove trailing slash to avoid double-slash in remote URL
domain = domain.replace(/\/+$/, '');

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/container/latest/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        // use absolute URL so Module Federation injects a full script src
        marketing: `marketing@${domain}/marketing/latest/remoteEntry.js`,
      },
      shared: packageJson.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
