/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-05-09 21:16:16
 * @LastEditTime : 2022-06-09 00:08:08
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\webpack\webpack.prod.js
 * @Description  : 
 */
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const { babelLoader } = require('./loaders');

const srcPath = path.join(__dirname, '../src/renderer');

module.exports = merge(baseConfig, {
  mode: 'production',
  module: {
    rules: [
      babelLoader(srcPath),
    ]
  }
})