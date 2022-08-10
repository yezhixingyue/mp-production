import { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import Axios from './axios';

const apiListByNotNeedToken = ['/Api/Staff/Login']; // 不需要token访问的接口列表

const instance = new Axios({
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      const userStore = useUserStore();
      const router = useRouter();
      const curConfig = config;
      const { token } = userStore;

      if (!token && !apiListByNotNeedToken.includes(curConfig.url || '')) {
        router.replace('/login');
        throw new Error('请重新登录');
      }
      curConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log(config);

      return config;
    },
    // 响应拦截器
    responseInterceptors: (result:AxiosResponse) => {
      console.log(result, 'result');

      if (result.data.Status !== 1000) {
        alert(result.data.Message);
      }
      return result;
    },
    responseInterceptorsCatch: (error:any) => {
      console.log(error.response, 'error');
      const router = useRouter();
      const userStore = useUserStore();
      if (error.response) {
        let _msg = '';
        switch (error.response.status) {
          case 401:
            userStore.token = '';
            console.log(error.response.status);
            router.replace('/login');
            break;
          case 403:
            break;
          case 404:
            break;
          case 413: // 处理文件导出错误
            break;
          case 500:
            _msg = '服务器内部错误';
            break;
          case 501:
            _msg = '服务器无法识别请求';
            break;
          case 502:
            _msg = '网关错误';
            break;
          case 503:
            _msg = '服务不可用';
            break;
          case 504:
            _msg = '网关超时';
            break;
          case 505:
            _msg = 'HTTP 版本不受支持';
            break;
          default:
            _msg = '系统暂无响应，请重试';
            if (error.response.data) {
              if (error.response.data.Message) {
                _msg = error.response.data.Message;
              } else {
                _msg = `系统出错，错误码：${error.response.data.Status || 505}`;
              }
            }
            break;
        }
        if (_msg) {
          messageBox.failSingleError('操作失败', _msg);
        }
        return Promise.reject(error.response);
      }
      return Promise.reject(error);
    },
  },
});

export default instance;
