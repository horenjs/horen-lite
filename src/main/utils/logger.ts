import fs from "fs";
import chalk from "chalk";

export interface LoggerConfig {
  logLevel: string;
  dateFormat: string | false;
  filePath: string | null;
}

export default class Logger {
  private _defaultConfig: LoggerConfig = {
    logLevel: "DEBUG",
    dateFormat: "YYYY-MM-DD",
    filePath: null,
  };

  constructor(private logName: string, private config?: LoggerConfig) {
    this.config = { ...this._defaultConfig, ...config };
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

    process.stderr.write(toWrite);

    if (this.config.filePath) {
      fs.appendFile(this.config.filePath, toWriteColor, (err) => {
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
    return new Date().toLocaleDateString();
  }

  public debug(...msg) {
    this.config.logLevel = "DEBUG";
    const m = msg.join("");
    this.log(m, m);
  }

  public info(...msg) {
    this.config.logLevel = "INFO";
    const m = msg.join("");
    const cm = chalk.cyan(m);
    this.log(m, cm);
  }

  public warning(...msg) {
    this.config.logLevel = "WARNING";
    const m = msg.join("");
    const cm = chalk.yellow(m);
    this.log(m, cm);
  }

  public error(...msg) {
    this.config.logLevel = "ERROR";
    const m = msg.join("");
    const cm = chalk.red(m);
    this.log(m, cm);
  }

  public critic(...msg) {
    this.config.logLevel = "CRITIC";
    const m = msg.join("");
    const cm = chalk.bgRed(m);
    this.log(m, cm);
  }
}
