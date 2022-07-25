import fs from "fs";

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

  public log(msg: string) {
    const toWrite = [
      this.getDate(),
      `[${this.config.logLevel}]`,
      `<${this.logName}>`,
      msg + "\n",
    ].join(" ")
    process.stderr.write(toWrite);
    if (this.config.filePath) {
      fs.appendFile(this.config.filePath, toWrite, (err) => {
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
    return new Date().valueOf();
  }

  public debug(...msg) {
    this.config.logLevel = "DEBUG";
    this.log(msg.join(""));
  }

  public info(...msg) {
    this.config.logLevel = "INFO";
    this.log(msg.join(""));
  }

  public warning(...msg) {
    this.config.logLevel = "WARNING";
    this.log(msg.join(""));
  }

  public error(...msg) {
    this.config.logLevel = "ERROR";
    this.log(msg.join(""));
  }

  public critic(...msg) {
    this.config.logLevel = "CRITIC";
    this.log(msg.join(""));
  }
}
