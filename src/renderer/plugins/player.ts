import { Howl, Howler } from "howler";
import debug from "./debug";

const logger = debug("Plugin:Player");

export type DateType = string | number | Date;

export type PictureType = string | Buffer;

export type PlayMode = "repeat" | "in-turn" | "random" | "in-turn-loop";

type TrackType = {
  src: string;
  title: string;
  artist: string;
  artists: string[];
  album: string;
  duration: number;
  date: DateType;
  genre: string;
  picture: PictureType;
}

export type Track = Partial<TrackType>;

export type PlayerConfig = {
  autoPlay?: boolean;
  formats?: string[];
}

if (typeof window === "undefined") {
  throw new Error("Howler Player can only run on the browser.");
}

export default class Player {
  protected __howler?: Howl;
  private _format = ["flac", "mp3"];
  private _trackList: Track[];
  private _track: Track;
  private _isPlaying: boolean;
  private _volume = 0.5;
  private _seek = 0;
  private _playMode: PlayMode = "in-turn-loop";
  private _isAutoPlay = false;

  constructor(private config?: PlayerConfig) {
    if (config?.autoPlay) {
      this._isAutoPlay = config.autoPlay;
    }

    if (config?.formats) {
      this._format = config.formats;
    }
  }

  get seek(): number {
    return this.__howler?.seek();
  }

  set seek(value: number) {
    this._seek = value;
    this.__howler?.seek(value);
  }

  get format(): string[] {
    return this._format;
  }

  set format(value: string[]) {
    this._format = value;
  }

  get trackList(): Track[] {
    return this._trackList;
  }

  set trackList(value: Track[]) {
    this._trackList = value;
  }

  get track(): Track {
    return this._track;
  }

  set track(value: Track) {
    this._track = value;
    logger("track: ", value);
    // value can be null;
    if (value && value.src) {
      logger("current track index: ", this.trackList.indexOf(value));
      this._playFromSource(value.src);
    } else {
      // do nothing.
    }
  }

  get isPlaying(): boolean {
    return this.__howler?.playing();
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = value;
  }

  get playMode(): PlayMode {
    return this._playMode;
  }

  set playMode(value: PlayMode) {
    this._playMode = value;
  }

  get isAutoPlay(): boolean {
    return this._isAutoPlay;
  }

  set isAutoPlay(value: boolean) {
    this._isAutoPlay = value;
  }

  public load(list: Track[], idx=0) {
    this._trackList = list;
    this.track = this._trackList[idx];
  }

  private play() {
    // if there is a howler, do nothing
    if (this.__howler?.playing()) return;
    // play current track, otherwise
    this.__howler?.play();
    // monitor the current track is ended
    this.__howler?.once("end", () => this._skip("next"));
  }

  public stop() {
    this.__howler?.stop();
  }

  public pause() {
    this.__howler?.pause();
  }

  public playOrPause() {
    if (this.__howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  public prev() {
    this._skip("prev");
  }

  public next() {
    this._skip("next");
  }

  public mute() {
    Howler.mute(true);
  }

  public unmute() {
    Howler.mute(false);
  }

  private _skip(flag: "prev" | "next") {
    // if there is no track in the list, do nothing
    if (!this._trackList?.length) return;
    // find the index of current playing track
    const idx = this._trackList?.indexOf(this._track);
    // skip to the specific idx
    this._skipTo(flag, idx, this._trackList?.length);
  }

  private _skipTo(flag: "prev" | "next", index: number, length: number) {
    switch (this._playMode) {
    case "in-turn-loop": {
      if (flag === "next") {
        if (index >= length - 1) {
          this.track = this.trackList[0];
          logger("current is the last one, next play: ", 0);
        } else {
          this.track = this.trackList[index + 1];
          logger("next play: ", index + 1);
        }
      } else if (flag === "prev") {
        if (index < 1) {
          this.track = this.trackList[length - 1];
          logger("current is the first one, prev play: ", length - 1);
        } else {
          this.track = this.trackList[index - 1];
          logger("prev play: ", index - 1);
        }
      }
      break;
    }
    case "repeat": {
      // if play mode is repeat, do nothing.
      logger("play mode is repeat, play it from begin again.");
      this.track = this.trackList[index];
      break;
    }
    case "in-turn": {
      if (flag === "next") {
        if (index >= length - 1) {
          // if the track is the last one, do nothing.
          logger("the last one, do nothing.");
        } else this.track = this.trackList[index + 1];
      } else {
        if (index < 1) {
          logger("the first one, do nothing.");
        } else this.track = this.trackList[index - 1];
      }
      break;
    }
    case "random": {
      // todo: memorize the tracks passed.
      const i = randomInt(0, length - 1);
      // 如果随机到的数与当前正在播放的相差在 1 位以内
      // 则重新进行随机以制造出伪随机的效果
      if (Math.abs(i - index) < 2) this._skipTo(flag, index, length);
      else this.track = this.trackList[i];
      break;
    }
    }
  }

  private _playFromSource(src: string) {
    Howler.unload();
    logger("track to play: ", src);
    logger("is auto play: ", this._isAutoPlay);

    this.__howler = new Howl({
      src: [src],
      format: this.format,
      html5: true,
      volume: this.volume,
      autoplay: this._isAutoPlay,
    });

    if (this._isAutoPlay) {
      this.play();
    }
  }
}

/**
 * 返回给定范围内的随机整数
 * @param min 区间最小值(含)
 * @param max 区间最大值(含)
 * @returns 随机整数
 */
function randomInt(min, max) {
  return parseInt(String(Math.random() * (max - min + 1)), 10);
}