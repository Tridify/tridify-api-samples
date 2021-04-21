const path = require('path');
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(appDirectory, "public/index.html"),
    }),
    new CleanWebpackPlugin(),
  ],
  mode: "development",
}
