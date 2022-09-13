const { defineConfig } = require('@vue/cli-service');

const publicPath = process.env.NODE_ENV === 'development' ? '' : '/PD/';

const proxyUrl = 'http://192.168.1.92:8052'; // 测试
// const proxyUrl = 'http://192.168.3.253:2022'; // 吕伟

// const imgUrl = 'http://192.168.1.92:8050';

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
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
      '/Storage': { // 代理临时图片地址
        target: proxyUrl,
        ws: true,
        changeOrigin: true,
      },
    },
  },

  configureWebpack: {
    devtool: 'source-map',
  },
});
