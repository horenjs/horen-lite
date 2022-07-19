/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-05-09 20:52:56
 * @LastEditTime : 2022-06-08 21:59:44
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\webpack\rules.js
 * @Description  : 
 */
function jsRulesDev(includePath) {
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: includePath,
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

function jsRules(includePath) {
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: includePath,
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

function babelTsLoader(p) {
  return {
    test: /\.ts$/,
    include: p,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
        ]
      }
    }
  }
}

function lessLoader(p) {
  return {
    test: /\.less$/i,
    include: p,
    use: [
      "style-loader",
      "css-loader",
      "less-loader",
    ]
  }
}

function resourceLoader(p) {
  return {
    test: /\.png/i,
    include: p,
    type: "asset/resource",
  }
}

module.exports = {
  jsRulesDev,
  jsRules,
  babelTsLoader,
  lessLoader,
  resourceLoader,
}