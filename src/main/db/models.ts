import { DataTypes } from "sequelize";
import db from "./index";

const audioField = {
  dir: { type: DataTypes.STRING, allowNull: false },
  src: { type: DataTypes.STRING, allowNull: true, primaryKey: true, },
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  artist: { type: DataTypes.STRING, allowNull: true },
  artists: { type: DataTypes.STRING, allowNull: true },
  album: { type: DataTypes.STRING, allowNull: true },
  duration: { type: DataTypes.NUMBER, allowNull: true },
  date: { type: DataTypes.STRING, allowNull: true },
  genre: { type: DataTypes.STRING, allowNull: true },
  picture: { type: DataTypes.STRING, allowNull: true },
  lyric: { type: DataTypes.STRING, allowNull: true },
}

const favoriteField = {
  ...audioField,
  addAt: { type: DataTypes.NUMBER, allowNull: false, defaultValue: new Date().valueOf() },
}

const audioOpts = {
  sequelize: db,
  modelName: "Audios",
  timestamps: false,
}

const favoriteOpts = {
  sequelize: db,
  modelName: "Audios",
  timestamps: false,
}

const AudioModel = db.define("Audio", audioField, audioOpts);
const FavoriteModel = db.define("Favorite", favoriteField, favoriteOpts);

export {
  AudioModel,
  FavoriteModel,
};
