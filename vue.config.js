/* eslint-disable no-param-reassign */
const { defineConfig } = require('@vue/cli-service');
require('events').EventEmitter.defaultMaxListeners = 20; // 将MaxListeners的限制数增加到20

const isDev = process.env.NODE_ENV === 'development';

let publicPath = '';
if (!isDev) {
  publicPath = process.env.VUE_APP_TARGET === 'My Order App' ? '/Order/' : '/Web/';
}

// const proxyUrl = 'http://192.168.1.92:8052'; // 测试
const proxyUrl = 'http://42.233.43.252:7001'; // 正式
// const proxyUrl = 'http://192.168.3.68:8052'; // 强哥
// const proxyUrl = 'http://192.168.3.253:2022'; // 吕伟

// const imgUrl = 'http://192.168.1.92:8050';

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  productionSourceMap: isDev,
  devServer: {
    proxy: {
      // '/Api/Upload': { // 代理上传图片地址
      //   target: proxyUrl,
      //   ws: true,
      //   changeOrigin: true,
      // },
      '/Api': {
        target: proxyUrl,
        ws: true, // 开启websockets
        changeOrigin: true,
      },
      '/HeadPic': { // 代理员工照片地址
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/Temp': { // 代理临时图片地址
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/Storage': { //
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/PlateFile': { //
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/File': { // 代理临时图片地址
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/QRCode': { // 代理二维码图片获取地址
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/signalr': { // 代理websocket
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
    },
  },

  // configureWebpack: {
  //   devtool: 'source-map',
  // },
  configureWebpack: config => {
    config.devtool = process.env.NODE_ENV === 'development' ? 'source-map' : false;
    // 处理图标乱码的问题 （是否解决待确认）
    config.module.rules.filter(rule => rule.test.toString().indexOf('scss') !== -1).forEach(rule => {
      rule.oneOf.forEach(oneOfRule => {
        oneOfRule.use.splice(
          oneOfRule.use.indexOf(require.resolve('sass-loader')),
          0,
          { loader: require.resolve('css-unicode-loader') },
        );
      });
    });
  },
});
