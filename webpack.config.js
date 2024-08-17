const serverlessWebpack = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: serverlessWebpack.lib.entries,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  node: false,
  externals: [nodeExternals()],
  optimization: {
    concatenateModules: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  resolve: {
    extensions: ['.mjs', '.ts', '.js'],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  target: 'node',
  experiments: {
    topLevelAwait: true,
  },
};
