import axios from "axios";
import lyric from "@plugins/lyric";

const NETEASE_API_URL = {
  lrc: "https://music.163.com/api/song/lyric",
  search: "https://music.163.com/api/search/get/web",
};

type Song = Partial<{
  id: number;
  name: string;
  artists: Artist[];
  album: Album;
  duration: number;
  copyrightId: number;
  status: number;
  alias: string[];
  rtype: number;
  ftype: number;
  mvid: number;
  fee: number;
  rUrl: string | null;
  mark: number;
}>

type Artist = Partial<{
  name: string,
  id: number,
  picId: number,
  img1v1id: number,
  picUrl: string,
  img1v1Url: string,
  albumSize: number,
  alias: string[],
  trans: string,
  musicSize: number,
  picId_str: string,
}>;

type Album = Partial<{
  name: string,
  id: number,
  type: string,
  size: number,
  picId: number,
  blurPicUrl: string,
  companyId: number,
  pic: number,
  picUrl: string,
  publishTime: number, // linux time stamp
  description: string,
  tags: string,
  company: string,
  briefDesc: string,
  artist: Artist,
  songs: [],
  alias: string[],
  status: number,
  copyrightId: number,
  commentThreadId: string,
  artists: Artist[],
}>

export interface SearchLyricResult {
  result: {
    songs?: Song[],
    songCount?: number,
  },
  code: number,
}

export interface LyricResult {
  sgc: boolean;
  sfy: boolean;
  qfy: boolean;
  lrc: {
    version: number;
    lyric: string;
  },
  code: number;
}

export class Netease {
  private readonly searchLyricKw: string;

  constructor(private title: string, private artist: string) {
    this.searchLyricKw = title + artist;
  }

  private async searchLyricResult() :Promise<SearchLyricResult> {
    const data = {
      s: this.searchLyricKw,
      type: 1, // 1: song; 10: albums
      offset: 0,
      total: true,
      limit: 30,
    };
    try {
      const res = await axios.get(NETEASE_API_URL.search, {params: data});
      if (res.status === 200) {
        if (typeof res.data === "string") {
          return JSON.parse(res.data);
        } else {
          return res.data;
        }
      }
    } catch (err) {
      throw new Error("search failed.");
    }
  }

  private static async getLyricResult(uid: number) :Promise<LyricResult> {
    const data = {
      id: uid,
      lv: -1,
    };
    try {
      const res = await axios.get(NETEASE_API_URL.lrc, {params: data});
      if (res.status === 200) {
        if (typeof res.data === "string") {
          return JSON.parse(res.data);
        } else {
          return res.data;
        }
      }
    } catch (err) {
      throw new Error("get lyric result failed.");
    }
  }

  public async getLyric() :Promise<string> {
    const searchLyricResult = await this.searchLyricResult();
    const songs = searchLyricResult.result?.songs;
    if (songs?.length > 0) {
      for (const song of songs) {
        if (song.artists[0].name === this.artist) {
          const uid = song.id;
          try {
            const lyricResult = await Netease.getLyricResult(uid);
            return lyricResult.lrc.lyric;
          } catch (err) {
            throw new Error("get lyric failed.");
          }
        }
      }
    }
  }
}
