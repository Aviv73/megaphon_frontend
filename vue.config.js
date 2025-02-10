// const CompressionPlugin = require('compression-webpack-plugin');
// require('../../old proj/megaphone_backend/src/public/apps/client')
module.exports = {
  outputDir: '../megaphon_backend/src/public/frontend',
  // outputDir: '../../old proj/megaphone_backend/src/better-api/public/frontend',
  pages: {
    index: {
      entry: "src/main.js",
      template: 'public/index.html',
      filename: 'index.html',
      title: "Megaphon"
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
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       additionalData: `@import "@/assets/styles/global/index.scss";`
  //     }
  //   }
  // }
}