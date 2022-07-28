import fs from "fs";
import path from "path";
import { DEFAULT_SETTING, USER_DATA_PATH } from "@constant";

export type SettingValue = object | string | number | boolean;

export type SettingFile = object;

export default class SettingStore {
  private readonly defaultSettingFileName = "setting.default.json";
  private readonly userSettingFileName = "setting.user.json";
  private readonly defaultSettingPath: string;
  private readonly userSettingPath: string;
  private readonly encoding = "utf-8";

  constructor() {
    this.defaultSettingPath = path.join(USER_DATA_PATH, this.defaultSettingFileName);
    this.userSettingPath = path.join(USER_DATA_PATH, this.userSettingFileName);

    if (!fs.existsSync(USER_DATA_PATH)) {
      fs.mkdirSync(USER_DATA_PATH);
    }

    try {
      fs.readFileSync(this.defaultSettingPath, { encoding: this.encoding });
    } catch (err) {
      fs.writeFileSync(
        this.defaultSettingPath,
        JSON.stringify(DEFAULT_SETTING, null, 2),
        {
          encoding: this.encoding,
        }
      );
    }

    try {
      fs.readFileSync(this.userSettingPath, { encoding: this.encoding });
    } catch (err) {
      fs.writeFileSync(
        this.userSettingPath,
        JSON.stringify(DEFAULT_SETTING, null, 2),
        { encoding: this.encoding }
      );
    }
  }

  public save(item: string, value: SettingValue) :SettingFile {
    let data: object = {};

    try {
      const str = fs.readFileSync(this.userSettingPath, { encoding: this.encoding });
      if (str) data = JSON.parse(str);
    } catch (err) {
      console.log("cannot read setting file");
    }

    data[item] = value;
    data["updateAt"] = new Date().valueOf();

    try {
      fs.writeFileSync(this.userSettingPath, JSON.stringify(data, null, 2), {
        encoding: this.encoding,
      });
      return data;
    } catch (err) {
      throw new Error("save setting item failed.");
    }
  }

  public get(item: string) :SettingValue {
    let foundValue;
    try {
      foundValue = this.getCombineSetting()[item];
      return foundValue;
    } catch (err) {
      throw new Error("cannot find the item: " + item);
    }
  }

  public getAll() :SettingValue {
    return this.getCombineSetting();
  }

  private getCombineSetting() :SettingFile {
    let defaultStr: string;
    let userStr: string;

    let defaultJson: object;
    let userJson: object;

    try {
      defaultStr = fs.readFileSync(this.defaultSettingPath, { encoding: this.encoding });
      defaultJson = JSON.parse(defaultStr);
    } catch (err) {
      defaultJson = DEFAULT_SETTING;
    }

    try {
      userStr = fs.readFileSync(this.userSettingPath, {encoding: this.encoding});
      userJson = JSON.parse(userStr);
    } catch (err) {
      userJson = {};
    }

    return {...defaultJson, ...userJson};
  }
}
