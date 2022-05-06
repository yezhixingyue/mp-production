const { defineConfig } = require('@vue/cli-service');

const proxyUrl = 'http://192.168.1.92:8050';

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
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
    },
  },
});
