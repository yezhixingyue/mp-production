import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { create } from './request-lib/bus';
import { ICoreOptions } from './request-lib/core/types';
import { LoadingHandler } from './utils/LoadingHandler';
import { handleErrorToast } from './utils/handleErrorToast';

const logout = () => { // 清除状态并跳转登录页面
  const userStore = useUserStore();
  userStore.token = '';
  window.location.href = `${window.location.href.split('#')[0] || ''}#/login`;
};

const getToken = () => { // 获取到token
  const _token = useUserStore().token;

  if (!_token) {
    logout();
  }

  return _token;
};

const useCatchError = (msg: string) => ElMessage({ showClose: true, message: msg || '请求失败', type: 'error' }); // 错误处理

const useResponse: ICoreOptions['useResponse'] = (resp, { clear, closeTip, msgCallback, tipTitle }) => { // 还需要 tipTitle 与 msgCallback 字段
  if (resp.status === 200 && resp.data?.Status === 1000) return;

  if (resp.status !== 200) { // 请求错误
    handleErrorToast(resp, () => {
      clear();
      logout();
    });

    return;
  }

  if (!closeTip && resp.data) { // 请求失败 -- closeTip 是否进行错误提示
    if ([8037, 7025].includes(resp.data.Status)) {
      clear();
      logout();
      ElMessage({ showClose: true, message: '请重新登录', type: 'error' });
    } else {
      MpMessage.error({
        title: tipTitle || '操作失败',
        msg: `[ ${resp.data?.Message} ]`,
        onCancel: () => msgCallback && msgCallback(),
        onOk: () => msgCallback && msgCallback(),
      });
    }
  }
};

export const instance = create({
  loadingHandler: new LoadingHandler(),
  // cache: {
  //   duration: 500,
  //   isCacheable: resp => resp.status === 200 && resp.data.Status === 1000,
  // },
  getToken,
  useResponse,
  useCatchError,
  isSuccess: resp => resp.status === 200 && resp.data?.Status === 1000,
});
