/* eslint-disable no-param-reassign */
const { defineConfig } = require('@vue/cli-service');
require('events').EventEmitter.defaultMaxListeners = 20; // 将MaxListeners的限制数增加到20

// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

let publicPath = '';
if (!isDev) {
  // publicPath = process.env.VUE_APP_TARGET === 'My Order App' ? '/Order/' : '/Web/';
  publicPath = '/Web/';
}

process.env.VUE_APP_VERSION = require('./package.json').version;

const proxyUrl = 'http://192.168.1.92:8052'; // 测试
// const proxyUrl = 'http://42.233.43.252:7001'; // 正式
// const proxyUrl = 'http://192.168.2.238:8052'; // 强哥
// const proxyUrl = 'http://192.168.3.253:2022'; // 吕伟

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
      '/TestFile': { //
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/PlateFile': { //
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/ImpositionFile': { //
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      '/File': { // 代理临时图片地址
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
      // '/QRCode': { // 代理二维码图片获取地址
      //   target: proxyUrl,
      //   ws: true,
      //   changeOrigin: true,
      // },
      '/signalr': { // 代理websocket
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
    },
  },

  configureWebpack: config => {
    config.devtool = isDev ? 'source-map' : false;

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

    // config.plugin('define').tap((definitions) => {
    //   Object.assign(definitions[0], {
    //     __VUE_OPTIONS_API__: 'true',
    //     __VUE_PROD_DEVTOOLS__: 'false',
    //     __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    //   });
    //   return definitions;
    // });

    config.plugins.push(new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    }));
  },
});
