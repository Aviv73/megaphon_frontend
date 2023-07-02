// const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  outputDir: '../../../megaphone_backend/src/public/apps/agam',
  pages: {
    index: {
      entry: "src/main.js",
      template: 'public/index.html',
      filename: 'index.html',
      title: "אגם הוצאת ספרים"
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