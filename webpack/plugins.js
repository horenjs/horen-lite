/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-05-09 21:10:52
 * @LastEditTime : 2022-06-07 23:24:18
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-ts\webpack\plugins.js
 * @Description  : 
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

function htmlPlugin() {
  return new HtmlWebpackPlugin({
    template: `${path.join(__dirname, "../public")}/index.html`
  });
}

function reactRefreshPlugin() {
  return new ReactRefreshWebpackPlugin();
}

module.exports = {
  htmlPlugin,
  reactRefreshPlugin,
}