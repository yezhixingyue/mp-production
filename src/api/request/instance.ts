import { AxiosResponse } from 'axios';
import { useUserStore } from '@/store/modules/user';
import { router } from '@/router';
import messageBox from '@/assets/js/utils/message';
import { ElLoading, ElMessage } from 'element-plus';
import Axios from './axios';
import { ICatch, IMPAxiosInstance, IRequestConfig } from './types';
import { setRequestHeaderMiddleware } from './utils';
import { clientApiUrls } from '../modules/clientApis';

const apiListByNotNeedToken = ['/Api/Staff/Login']; // 不需要token访问的接口列表

let requestNum = 0;
let loadingInstance;
const getShowLoading = (config?: IRequestConfig) => { // 查看当前请求是否需要展示弹窗
  let showLoading = true;
  const arr = ['/Api/MaterialType/All', '/Api/Upload/File', '/Api/SingleMaterial/ByType', '/Api/FileNode']; // 不需要展示loading的api地址
  if (config && config.url) {
    for (let i = 0; i < arr.length; i += 1) {
      if (config.url.split('?')[0].includes(arr[i]) || config.closeLoading) {
        showLoading = false;
      }
    }
  }
  return showLoading;
};
// 出库的时候连续调用接口 关闭loading后 类名 el-loading-parent--relative 属性 loading-number 残留 手动删除
const loadingInstanceClose = () => {
  const obody = document.querySelector('body');
  obody?.classList.remove('el-loading-parent--relative');
  obody?.removeAttribute('loading-number');
  loadingInstance.close();
};

const handleLoadingOpen = () => { // 打开弹窗
  requestNum += 1;
  // eslint-disable-next-line max-len
  const spinner = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>';
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    svgViewBox: '0 0 20 20',
    spinner,
    background: 'rgba(255, 255, 255, 0.3)',
    customClass: 'mp-general-loading-box',
  });
};
const handleLoadingClose = () => { // 关闭弹窗
  requestNum -= 1;
  if (requestNum < 0) requestNum = 0;
  if (requestNum === 0 && loadingInstance) loadingInstanceClose();
};

const axios = new Axios({
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config: IRequestConfig) => {
      const userStore = useUserStore();
      // const router = useRouter();
      const curConfig = config;
      const { token } = userStore;

      if (!token && !apiListByNotNeedToken.includes(curConfig.url || '') && !clientApiUrls.includes(config.url || '')
       && !curConfig.headers?.sign && !curConfig.headers?.Authorization) {
        router.replace('/login');

        throw new Error('请重新登录');
      }
      if (curConfig.headers) {
        setRequestHeaderMiddleware(curConfig, token);
      }
      // 打开loading
      if (getShowLoading(curConfig)) handleLoadingOpen();
      return config;
    },
    // 响应拦截器
    responseInterceptors: (result:AxiosResponse) => {
      // 关闭loading
      if (getShowLoading(result.config as IRequestConfig) && loadingInstance) handleLoadingClose();
      const userStore = useUserStore();
      if (result.data.Status !== 1000) {
        if (result.data.Status === 8037) {
          axios.cancelAllRequest();
          const cb = () => {
            const host = window.location.href.split('#')[0] || '';
            userStore.token = '';
            window.location.href = `${host}#/login`;
          };
          messageBox.failSingle('请重新登录', cb, cb);
        } else {
          messageBox.failSingleError('操作失败', result.data.Message, () => null);
        }
      }
      return result;
    },
    responseInterceptorsCatch: (error:ICatch) => {
      if (getShowLoading(error.config as IRequestConfig) && loadingInstance) handleLoadingClose();

      const userStore = useUserStore();
      if (error.response) {
        let _msg = '';
        switch (error.response.status) {
          case 401:
            axios.cancelAllRequest();
            userStore.token = '';
            window.location.href = `${window.location.href.split('#')[0] || ''}#/login`;
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
      if (error?.message === 'Network Error') {
        ElMessage({
          showClose: true,
          message: '网络错误',
          type: 'error',
        });
      } else if (error.message && error.message.includes('timeout')) {
        ElMessage({
          showClose: true,
          message: '网络超时',
          type: 'error',
        });
      } else if (error.response && (error.response as AxiosResponse).status === 404) {
        ElMessage({
          showClose: true,
          message: '404错误',
          type: 'error',
        });
      } else {
        let msg = '';
        if (error.response && (error.response as AxiosResponse).data && (error.response as AxiosResponse).data.Message) {
          msg = (error.response as AxiosResponse).data.Message;
        } else if (error && error.message) {
          msg = error.message;
        }
        if (msg) {
          ElMessage({
            showClose: true,
            message: msg,
            type: 'error',
          });
        }
      }
      return Promise.reject(error);
    },
  },
});

export default axios;

export const { instance } = axios as { instance: IMPAxiosInstance };
