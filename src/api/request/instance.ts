import Axios from './axios';

const instance = new Axios({
  // baseURL: import.meta.env.BASE_URL,
  // timeout: 1000 * 60 * 5,
  // interceptors: {
  //   // 请求拦截器
  //   requestInterceptors: config => config,
  //   // 响应拦截器
  //   responseInterceptors: result => result,
  // },
});

export default instance;
