import fse from "fs-extra";
import path from "path";
import * as Chalk from "chalk";
import Dato from "./dato";

export interface LoggerConfig {
  logLevel?: string;
  dateFormat?: string | false;
  filePath?: string | null;
}

export default class Logger {
  private _chalk;
  private _defaultConfig: LoggerConfig = {
    logLevel: "DEBUG",
    dateFormat: "YYYY-MM-DD",
    filePath: null,
  };

  constructor(private logName: string, private config?: LoggerConfig) {
    this.config = { ...this._defaultConfig, ...config };
    this._chalk = new Chalk.Instance({level: 3});
  }

  public log(msg: string, cMsg: string) {
    const toWrite = [
      this.getDate(),
      `[${this.config.logLevel}]`,
      `<${this.logName}>`,
      msg + "\n",
    ].join(" ");

    const toWriteColor = [
      this.getDate(),
      `[${this.config.logLevel}]`,
      `<${this.logName}>`,
      cMsg + "\n"
    ].join(" ");

    process.stderr.write(toWriteColor);

    if (this.config.filePath) {
      fse.ensureDir(path.dirname(this.config.filePath)).then();
      fse.appendFile(this.config.filePath, toWrite, (err) => {
        if (err)
          throw new Error(
            "cannot write log msg to the file: " + this.config.filePath
          );
      });
    }
  }

  private getDate() {
    if (this.config.dateFormat === false) {
      return "";
    }
    return Dato.now("YYYY-MM-DD HH:mm:SS.sss");
  }

  public debug(...msg) {
    this.config.logLevel = "DEBUG";
    const m = msg.join("");
    this.log(m, m);
  }

  public info(...msg) {
    this.config.logLevel = "INFO";
    const m = msg.join("");
    const cm = this._chalk.cyan(m);
    this.log(m, cm);
  }

  public warning(...msg) {
    this.config.logLevel = "WARNING";
    const m = msg.join("");
    const cm = this._chalk.yellow(m);
    this.log(m, cm);
  }

  public error(...msg) {
    this.config.logLevel = "ERROR";
    const m = msg.join("");
    const cm = this._chalk.red(m);
    this.log(m, cm);
  }

  public critic(...msg) {
    this.config.logLevel = "CRITIC";
    const m = msg.join("");
    const cm = this._chalk.bgRed(m);
    this.log(m, cm);
  }
}
