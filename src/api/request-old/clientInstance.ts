/* eslint-disable max-len */
// import { Axios, AxiosResponse } from 'axios';
// import { ElLoading, ElMessage } from 'element-plus';
// import { MpMessage } from '@/assets/js/utils/MpMessage';
// import { SessionStorageClientHandler } from '@/views/ProductionClient/assets/js/SessionStorageHandler';
// import { ManageClientPageData } from './clientStore';
// import { downloadExcelApiUrls } from '../modules/downloadExcelApis';
// import { IRequestConfig, ICatch, IMPAxiosInstance } from '../request-old/types';

// let requestNum = 0;
// let loadingInstance;

// const loadingInstanceClose = () => {
//   const obody = document.querySelector('body');
//   obody?.classList.remove('el-loading-parent--relative');
//   obody?.removeAttribute('loading-number');
//   loadingInstance.close();
// };

// const handleLoadingOpen = () => { // 打开弹窗
//   requestNum += 1;
//   // eslint-disable-next-line max-len
//   const spinner = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>';
//   loadingInstance = ElLoading.service({
//     lock: true,
//     text: 'Loading',
//     svgViewBox: '0 0 20 20',
//     spinner,
//     background: 'rgba(255, 255, 255, 0.3)',
//     customClass: 'mp-general-loading-box',
//   });
// };
// const handleLoadingClose = () => { // 关闭弹窗
//   requestNum -= 1;
//   if (requestNum < 0) requestNum = 0;
//   if (requestNum === 0 && loadingInstance) loadingInstanceClose();
// };

// const logout = () => {
//   if (ManageClientPageData.value.curActiveInstance) {
//     ManageClientPageData.value.curActiveInstance.loginData.token = '';
//     ManageClientPageData.value.curActiveInstance.loginData.user = null;
//     SessionStorageClientHandler.clearItem(ManageClientPageData.value.curActiveInstance.Equipment.ID);
//   }
// };

// const axios = new Axios({
//   interceptors: {
//     // 请求拦截器
//     requestInterceptors: (config: IRequestConfig) => {
//       // 1. 打开全局loading弹窗
//       if (config.loading !== true) handleLoadingOpen();

//       // 2. 附加token
//       const _config = config;
//       const token = ManageClientPageData.value.curActiveInstance?.loginData.token;
//       if (_config.headers && token) {
//         _config.headers.Authorization = `Bearer ${token}`;
//       }

//       return config;
//     },
//     // 响应拦截器
//     responseInterceptors: (result:AxiosResponse) => {
//       if (loadingInstance && (result.config as IRequestConfig)?.loading !== true) handleLoadingClose();
//       if (result.data.Status !== 1000 && !downloadExcelApiUrls.includes(result.config.url || '') && !result.config.closeTip) {
//         if ([8037, 7025].includes(result.data.Status)) {
//           // 请重新登录
//           axios.cancelAllRequest();
//           logout();
//           ElMessage.error(result.data.Message || '请重新登录');
//         } else {
//           MpMessage.error({
//             title: '操作失败',
//             msg: result.data.Message,
//             onCancel: result.config.msgCallback || undefined,
//             onOk: result.config.msgCallback || undefined,
//           });
//         }
//       }
//       return result;
//     },
//     responseInterceptorsCatch: (error:ICatch) => {
//       if (loadingInstance && (error.config as IRequestConfig)?.loading !== true) handleLoadingClose();
//       if (error.response && !(error.config as IRequestConfig)?.closeTip) {
//         let _msg = '';
//         switch (error.response.status) {
//           case 401:
//             // 请重新登录
//             axios.cancelAllRequest();
//             logout();
//             break;
//           case 403:
//             break;
//           case 404:
//             _msg = '错误404，当前正在查找的资源不存在';
//             break;
//           case 413: // 处理文件导出错误
//             break;
//           case 500:
//             _msg = '服务器内部错误';
//             break;
//           case 501:
//             _msg = '服务器无法识别请求';
//             break;
//           case 502:
//             _msg = '网关错误';
//             break;
//           case 503:
//             _msg = '服务不可用';
//             break;
//           case 504:
//             _msg = '网关超时';
//             break;
//           case 505:
//             _msg = 'HTTP 版本不受支持';
//             break;
//           default:
//             _msg = '系统暂无响应，请重试';
//             if (error.response.data) {
//               if (error.response.data.Message) {
//                 _msg = error.response.data.Message;
//               } else {
//                 _msg = `系统出错，错误码：${error.response.data.Status || 505}`;
//               }
//             }
//             break;
//         }
//         if (_msg) {
//           MpMessage.error({
//             title: '操作失败',
//             msg: _msg,
//             onCancel: (error.config as IRequestConfig).msgCallback || undefined,
//             onOk: (error.config as IRequestConfig).msgCallback || undefined,
//           });
//         }
//         return Promise.reject(error.response);
//       }
//       if (error?.message === 'Network Error') {
//         ElMessage({
//           showClose: true,
//           message: '网络错误',
//           type: 'error',
//         });
//       } else if (error.message && error.message.includes('timeout')) {
//         ElMessage({
//           showClose: true,
//           message: '网络超时',
//           type: 'error',
//         });
//       } else if (error.response && (error.response as AxiosResponse).status === 404) {
//         ElMessage({
//           showClose: true,
//           message: '404错误',
//           type: 'error',
//         });
//       } else {
//         let msg = '';
//         if (error.response && (error.response as AxiosResponse).data && (error.response as AxiosResponse).data.Message) {
//           msg = (error.response as AxiosResponse).data.Message;
//         } else if (error && error.message) {
//           msg = error.message;
//         }
//         if (msg) {
//           ElMessage({
//             showClose: true,
//             message: msg,
//             type: 'error',
//           });
//         }
//       }
//       return Promise.reject(error);
//     },
//   },
// });

// export default axios;

// /** 报工模块axios实例 */
// export const clientInstance: IMPAxiosInstance = axios.instance;
