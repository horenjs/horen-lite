/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-08 21:54:09
 * @LastEditTime : 2022-06-08 22:00:57
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\webpack\main.webpack.js
 * @Description  : 
 */
const path = require('path');
const { babelTsLoader } = require("./rules");
const nodeExternals = require('webpack-node-externals');

const srcMainPath = path.join(__dirname, "../src/main");

module.exports = {
  target: "electron-main",
  mode: process.env.NODE_ENV,
  devtool: "inline-source-map",
  entry: {
    main: path.join(__dirname, "../src/main/index.ts"),
    preload: path.join(__dirname, "../src/preload/index.js"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
    clean: true,
  },
  resolve: {
    alias: {
      "@constant": path.join(__dirname, "../src/constant/index"),
    },
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      babelTsLoader(srcMainPath),
    ]
  },
  externals: [nodeExternals()]
}