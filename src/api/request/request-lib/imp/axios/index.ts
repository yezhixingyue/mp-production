import axios from 'axios';
import { IRequestor } from '../../core/types';

export const getRequestor = () => {
  const instance = axios.create();

  instance.interceptors.request.use(config => config, (error) => Promise.reject(error));

  instance.interceptors.response.use(result => result, (error) => {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    if (axios.isCancel(error)) {
      throw new Error('请求被取消');
    }

    throw error instanceof Error ? error : new Error(error || '请求失败');
  });

  const requestor: IRequestor = {
    request(config) {
      return instance.request(config); // 使用axios实现
    },
  };

  return requestor;
};
