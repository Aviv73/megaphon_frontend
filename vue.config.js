// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  outputDir: '../backend/public/frontend',
  pages: {
    index: {
      entry: "src/main.js",
      template: 'public/index.html',
      filename: 'index.html',
      title: "Project Starter"
    }
  },
  configureWebpack: {
    plugins: [
      // new CompressionPlugin({
      //   test: /\.js$|\.css$|\.html$/,
      //   threshold: 10240,
      //   minRatio: 0.8
      // })
    ]
  }
}