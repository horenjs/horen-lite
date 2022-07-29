import { Injectable } from "../decorators";
import SettingStore, {
  type SettingFile,
  type SettingValue
} from "../utils/setting-store";

@Injectable("SettingService")
export class SettingService {
  private store: SettingStore;

  constructor() {
    // do not delete this expression
    this.store = new SettingStore();
  }

  public saveItem(item: string, value: SettingValue) {
    try {
      return this.store.save(item, value);
    } catch (err) {
      throw new Error("save setting item failed: " + item);
    }
  }

  public getItem(item: string): SettingValue {
    try {
      return this.store.get(item);
    } catch (err) {
      throw new Error("get setting item failed: " + item);
    }
  }

  public getAllItems(): SettingFile {
    try {
      return this.store.getAll();
    } catch (err) {
      throw new Error("get all setting items failed.");
    }
  }
}