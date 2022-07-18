/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-08 22:16:24
 * @LastEditTime : 2022-06-08 22:19:26
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\config\index.d.ts
 * @Description  :
 */
type Config = {
  rendererHost: string;
  rendererPort: number;
};

declare const config: Config;

export default config;
