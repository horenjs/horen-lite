import { Sequelize, Options } from "sequelize";
import { USER_DATA_PATH } from "@constant";
import path from "path";
import Logger from "../utils/logger";

const log = new Logger("db");

const opts: Options = {
  dialect: "sqlite",
  storage: path.join(USER_DATA_PATH, "db.sqlite"),
  logging: false,
}

const sql = new Sequelize(opts);

const init = async () => {
  try {
    await sql.authenticate();
    await sql.sync();
    log.info("connect to db success");
  } catch (err) {
    log.error(err);
  }
}

(async () => await init())();

export default sql;