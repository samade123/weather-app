const { defineConfig } = require('@vue/cli-service')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: true,
  chainWebpack: config => {
    
   
    config.plugin("copy").use(CopyPlugin, [
      {
        patterns: [{ from: "src/api", to: "./api" }],
      },
    ]);
  }
})
