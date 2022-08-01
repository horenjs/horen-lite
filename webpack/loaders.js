/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-05-09 20:52:56
 * @LastEditTime : 2022-06-08 21:59:44
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\webpack\loaders.js
 * @Description  : 
 */
function babelLoaderDev(...includePath) {
  return {
    test: /\.(ts|tsx)$/,
    include: [...includePath],
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader?cacheDirectory',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          'react-refresh/babel'
        ]
      }
    }
  }
}

function babelLoader(...includePath) {
  return {
    test: /\.(ts|tsx)$/,
    include: [...includePath],
    use: {
      loader: 'babel-loader?cacheDirectory',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ]
      }
    }
  }
}

function babelLoaderMainProcess(...p) {
  return {
    test: /\.ts$/,
    include: [...p],
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          ['@babel/preset-typescript', {optimizeConstEnums: true,}],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          "babel-plugin-transform-typescript-metadata",
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ]
      }
    }
  }
}

function lessLoader(...p) {
  return {
    test: /\.less$/i,
    include: [...p],
    use: [
      "style-loader",
      "css-loader",
      "less-loader",
    ]
  }
}

function resourceLoader(...p) {
  return {
    test: /\.(png|jpg|jpeg|bmp|gif)/i,
    include: [...p],
    type: "asset/resource",
  }
}

module.exports = {
  babelLoaderDev,
  babelLoader,
  babelLoaderMainProcess,
  lessLoader,
  resourceLoader,
}