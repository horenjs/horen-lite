/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-08 21:54:09
 * @LastEditTime : 2022-06-08 22:00:57
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\webpack\main.webpack.js
 * @Description  : 
 */
const path = require('path');
const { babelLoaderMainProcess } = require("./loaders");
const nodeExternals = require('webpack-node-externals');

const mainPath = path.join(__dirname, "../src/main");
const preloadPath = path.join(__dirname, "../src/preload");
const constantPath = path.join(__dirname, "../src/constant");

module.exports = {
  target: "electron-main",
  mode: process.env.NODE_ENV,
  devtool: "inline-source-map",
  entry: {
    main: path.join(__dirname, "../src/main/index.ts"),
    preload: path.join(__dirname, "../src/preload/index.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
    clean: true,
  },
  resolve: {
    alias: {
      "@constant": constantPath,
    },
    extensions: [".ts"],
  },
  module: {
    rules: [
      babelLoaderMainProcess(mainPath, preloadPath, constantPath),
    ]
  },
  externals: [nodeExternals()]
}