// noinspection JSCommentMatchesSignature

const path = require('path');
const proc = require('child_process');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const prodConfig = require('./webpack/webpack.prod');
const devConfig = require('./webpack/webpack.dev');
const mainConfig = require('./webpack/main.webpack');
const electron = require("electron");

const NODE_ENV = process.env.NODE_ENV;

console.log(`NODE_ENV is ${NODE_ENV}.`);

const IS_DEV = NODE_ENV === 'development';
const distMainPath = ["./dist/main.js"];

if (IS_DEV) {
  const compiler = webpack(devConfig);
  const mainCompiler = webpack(mainConfig);

  runBuild(mainCompiler, () => {
    runServer(compiler, devConfig.devServer, () => {
      runElectron(distMainPath);
    });
  });
} else {
  const renderCompiler = webpack(prodConfig);
  const mainCompiler = webpack(mainConfig);
  runBuild(renderCompiler, () => {});
  runBuild(mainCompiler, () => {});
}

/**
 * 生成生产环境
 * @param {object} compiler webpack compiler
 */
function runBuild(compiler, cb) {
  compiler.run((err, stats) => {
    console.log('Start to compile...');

    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) console.error(info.errors);

    if (stats.hasWarnings()) console.error(info.warnings);

    compiler.close((closeErr) => {
      if (closeErr) {
        console.error(closeErr);
      } else {
        cb();
      }
    })
  })
}

/**
 * 开发服务器
 * @param {object} compiler webpack compiler
 * @param {object} opts webpack dev server options
 */
function runServer(compiler, opts, callback) {
  const server = new webpackDevServer(opts, compiler);
  server.startCallback(() => {
    console.log('Successfully started server on port: ' + opts.port);
    
    if (callback) callback();
  })
}

/**
 * run electron
 * @param {args} args args arrary
 */
function runElectron(args) {
  const cmds = ["electron", args]
  const eletronPath = path.resolve("./node_modules/electron/dist/electron.exe");
  /*
  proc.exec(cmds.join(" "), (err) => {
    if (err) {
      console.log(err);
    }
  }); */
  const child = proc.spawn(eletronPath, args, { stdio: 'inherit', windowsHide: false });
  child.on('close', function (code, signal) {
    if (code === null) {
      console.error(electron, 'exited with signal', signal);
      process.exit(1);
    }
    process.exit(code);
  });
  const handleTerminationSignal = function (signal) {
    process.on(signal, function signalHandler () {
      if (!child.killed) {
        child.kill(signal);
      }
    });
  };

  handleTerminationSignal('SIGINT');
  handleTerminationSignal('SIGTERM');
}

