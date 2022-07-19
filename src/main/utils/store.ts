import fs from "fs";
import path from "path";

export default class Store {
  private readonly p: string;
  private readonly encoding = "utf-8";

  constructor(private _p?: string) {
    const appPath = path.join(process.env.APPDATA, "horen-lite");
    this.p = this._p || path.join(appPath, "setting.json");

    if (!fs.existsSync(appPath)) {
      fs.mkdirSync(appPath);
    }
  }

  save(item: string, value: object | string | number | boolean) {
    let data: object = {};

    try {
      const str = fs.readFileSync(this.p, {encoding: this.encoding});
      if (str) data = JSON.parse(str);
    } catch (err) {
      console.log("cannot read setting file");
    }

    data[item] = value;
    data["updateAt"] = new Date().valueOf();

    try {
      fs.writeFileSync(this.p, JSON.stringify(data, null, 2), {encoding: this.encoding});
      return data;
    } catch (err) {
      throw new Error("save setting item failed.");
    }
  }

  get(item: string) {
    let str: string;
    let data;

    try {
      str = fs.readFileSync(this.p, {encoding: this.encoding});
    } catch (err) {
      str = "";
      throw new Error("setting file doesnt exist.");
    }

    if (str !== "") {
      try {
        data = JSON.parse(str)[item];
      } catch (err) {
        throw new Error("get setting item failed.");
      }
    }

    return data;
  }

  getAll() {
    try {
      const str = fs.readFileSync(this.p, {encoding: this.encoding});
      if (str !== "") {
        return JSON.parse(str);
      }
    } catch (err) {
      throw new Error("setting file doesnt exist.");
    }
  }
}