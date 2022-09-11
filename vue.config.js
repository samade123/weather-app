const { defineConfig } = require('@vue/cli-service')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: true,
  chainWebpack: config => {
    config.plugin("copy").use(CopyPlugin, [
      {
        patterns: [{ from: "src/api", to: "../api" }],
      },
    ]);
  },
  pwa: {
    name: 'Local Weather by Sam',
    themeColor: '#e6ebf4',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

  }
})
