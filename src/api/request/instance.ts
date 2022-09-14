import { AxiosResponse } from 'axios';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import { ElLoading } from 'element-plus';
import Axios from './axios';

const apiListByNotNeedToken = ['/Api/Staff/Login']; // 不需要token访问的接口列表

// const closeTip = false;
let requestNum = 0;
let loadingInstance;
const getShowLoading = (config) => { // 查看当前请求是否需要展示弹窗
  let showLoading = true;
  const arr = ['/Api/MaterialType/All', '/Api/Upload/File', '/Api/SingleMaterial/ByType']; // 不需要展示loading的api地址
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
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.3)',
    customClass: 'mp-general-loading-box',
  });
};
const handleLoadingClose = () => { // 关闭弹窗
  requestNum -= 1;
  if (requestNum < 0) requestNum = 0;
  if (requestNum === 0 && loadingInstance) loadingInstanceClose();
};

const instance = new Axios({
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      const userStore = useUserStore();
      const router = useRouter();
      const curConfig = config;
      const { token } = userStore;
      console.log(router, 'router');

      if (!token && !apiListByNotNeedToken.includes(curConfig.url || '')) {
        router.replace('/login');

        throw new Error('请重新登录');
      }
      curConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
      // 打开loading
      if (getShowLoading(curConfig)) handleLoadingOpen();
      return config;
    },
    // 响应拦截器
    responseInterceptors: (result:AxiosResponse) => {
      // 关闭loading
      if (getShowLoading(result.config) && loadingInstance) handleLoadingClose();
      const userStore = useUserStore();
      if (result.data.Status !== 1000) {
        if (result.data.Status === 8037) {
          instance.cancelAllRequest();
          messageBox.failSingle('请重新登录', () => {
            const host = window.location.href.split('#')[0] || '';
            userStore.token = '';
            window.location.href = `${host}#/login`;
          });
        } else {
          messageBox.failSingleError('操作失败', result.data.Message, () => null);
        }
      }
      return result;
    },
    responseInterceptorsCatch: (error:any) => {
      if (getShowLoading(error.config) && loadingInstance) handleLoadingClose();

      const userStore = useUserStore();
      if (error.response) {
        let _msg = '';
        switch (error.response.status) {
          case 401:
            userStore.token = '';
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
