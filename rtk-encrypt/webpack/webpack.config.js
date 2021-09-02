const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const {
  SRC_DIR,
  BUILD_DIR,
} = require('./constants')

const baseConfig = {
  devtool: 'source-map',
  entry: {
    index: path.resolve(SRC_DIR, 'index.ts'),
  },
  output: {
    filename: '[name].js',
    path: BUILD_DIR,
    library: 'VotingEncrypt',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.json', '.js'],
  },
  externals: {
    'seckp256k1': 'seckp256k1',
    'crypto': 'crypto',
    'randombytes': 'randombytes',
    'bn.js': 'bn.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: '../tsconfig.build.json',
          },
        },
      },
    ],
  },
}

module.exports = baseConfig
