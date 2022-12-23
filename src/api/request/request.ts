/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
// 该文件用于提供一个请求接口的方法，可以在该方法中设置响应拦截器，由于较繁琐 且目前用不到  暂时搁置

import { AxiosResponse } from 'axios';
import { useUserStore } from '@/store/modules/user';
import instance from './instance';

import type { IRequestConfig, IResponse } from './types';

interface IDataRequestConfig<T> extends IRequestConfig {
  data?: T
}

const setAuthorization = <D>(config: IDataRequestConfig<D>) => {
  const _config = { ...config };
  const userStore = useUserStore();
  if (userStore.token && _config.headers) {
    const Authorization = `Bearer ${userStore.token}`;
    _config.headers.Authorization = Authorization;
    if (config.headers?.['Content-Range']) {
      _config.headers['Content-Range'] = config.headers['Content-Range'];
    }
  }
  return _config;
};

/**
 * @description: 函数的描述
 * @interface D 请求参数的interface
 * @interface T 响应结构的intercept
 * @param {IDataRequestConfig} config
 * @returns {Promise}
 */
const request = <T = unknown, D = unknown>(config: IDataRequestConfig<D>): Promise<AxiosResponse<IResponse<T>>> => {
  const _configWithAuth = setAuthorization<D>(config);
  return instance.request<IResponse<T>>(_configWithAuth);
};

export default request;
