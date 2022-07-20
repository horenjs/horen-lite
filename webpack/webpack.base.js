/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-05-09 20:48:40
 * @LastEditTime : 2022-06-09 00:10:24
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\webpack\webpack.base.js
 * @Description  : 
 */
const path = require('path');
const { lessLoader, resourceLoader } = require('./rules');
const { htmlPlugin } = require('./plugins');

const srcPath = path.join(__dirname, '../src/renderer');

module.exports = {
  target: "electron-renderer",
  entry: {
    app: path.join(srcPath, 'index.tsx')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: 'chunk/[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      "@constant": path.resolve(__dirname, "../src/constant"),
      "@components": path.resolve(__dirname, '../src/renderer/components'),
      "@i18n": path.resolve(__dirname, "../src/renderer/i18n"),
      "@pages": path.resolve(__dirname, '../src/renderer/pages'),
      "@plugins": path.resolve(__dirname, "../src/renderer/plugins"),
      "@static": path.resolve(__dirname, "../src/renderer/static"),
      "@store": path.resolve(__dirname, '../src/renderer/store'),
    },
  },
  module: {
    rules: [
      lessLoader(srcPath),
      resourceLoader(srcPath),
    ],
  },
  plugins: [
    htmlPlugin(),
  ],
}