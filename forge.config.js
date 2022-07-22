/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-11 06:08:34
 * @LastEditTime : 2022-06-11 06:33:41
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\forge.config.js
 * @Description  :
 */
// eslint-disable-next-line no-undef
module.exports = {
  packagerConfig: {
    asar: true,
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [["@electron-forge/plugin-auto-unpack-natives"]],
};
