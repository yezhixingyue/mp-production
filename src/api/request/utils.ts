import { clientApiUrls } from '../modules/clientApis';
import { IRequestConfig } from './types';

/**
 * 在请求前对请求头等进行设置的中间件函数
 *
 * @param {IRequestConfig} config
 * @param {string} token
 * @returns
 */
export const setRequestHeaderMiddleware = (config: IRequestConfig, token: string) => {
  const _config = config;
  if (token && _config.headers) {
    // 如果接口不是来自客户端页面 则添加token
    if (config.url && !clientApiUrls.includes(config.url) && !_config.headers.Authorization) {
      _config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return _config;
};
