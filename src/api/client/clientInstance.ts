import { AxiosResponse } from 'axios';
import { ElLoading } from 'element-plus';
import messageBox from '@/assets/js/utils/message';
import { SessionStorageClientHandler } from '@/views/ProductionClient/assets/js/SessionStorageHandler';
import Axios from '../request/axios';
import { ICatch, IMPAxiosInstance, IRequestConfig } from '../request/types';
import { ManageClientPageData } from './clientStore';

let requestNum = 0;
let loadingInstance;

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

const logout = () => {
  if (ManageClientPageData.value.curActiveInstance) {
    ManageClientPageData.value.curActiveInstance.loginData.token = '';
    ManageClientPageData.value.curActiveInstance.loginData.user = null;
    SessionStorageClientHandler.clearItem(ManageClientPageData.value.curActiveInstance.Equipment.ID);
  }
};

const axios = new Axios({
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config: IRequestConfig) => {
      // 1. 打开全局loading弹窗
      if (config.closeLoading !== true) handleLoadingOpen();

      // 2. 附加token
      const _config = config;
      const token = ManageClientPageData.value.curActiveInstance?.loginData.token;
      if (_config.headers && token) {
        _config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    // 响应拦截器
    responseInterceptors: (result:AxiosResponse) => {
      if (loadingInstance && (result.config as IRequestConfig)?.closeLoading !== true) handleLoadingClose();
      if (result.data.Status !== 1000) {
        if ([8037, 7025].includes(result.data.Status)) {
          // 请重新登录
          axios.cancelAllRequest();
          logout();
        } else {
          messageBox.failSingleError('操作失败', result.data.Message, () => null);
        }
      }
      return result;
    },
    responseInterceptorsCatch: (error:ICatch) => {
      if (loadingInstance && (error.config as IRequestConfig)?.closeLoading !== true) handleLoadingClose();
      if (error.response) {
        let _msg = '';
        switch (error.response.status) {
          case 401:
            // 请重新登录
            axios.cancelAllRequest();
            logout();
            break;
          case 403:
            break;
          case 404:
            _msg = '错误404，当前正在查找的资源不存在';
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

export default axios;

/** 报工模块axios实例 */
export const clientInstance: IMPAxiosInstance = axios.instance;
