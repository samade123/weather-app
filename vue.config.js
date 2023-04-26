const { defineConfig } = require("@vue/cli-service");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  publicPath: "/",
  transpileDependencies: true,
  filenameHashing: true,
  chainWebpack: (config) => {
    config.plugin("copy").use(CopyPlugin, [
      {
        patterns: [
          { from: "src/api", to: "../api" },
          { from: "src/assets/csv", to: "./assets" },
          { from: "public/img/icons/", to: "./img/icons/" },
          { from: "public/favicon.ico", to: "./favicon.ico" }, // added this line
        ],
      },
    ]);

    config.module
      .rule("csv")
      .test(/\.csv$/)
      .use("csv-loader")
      .loader("csv-loader")
      .options({
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      });
  },
  pwa: {
    name: "Local Weather by Sam",
    themeColor: "#e6ebf4",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
  },
});
