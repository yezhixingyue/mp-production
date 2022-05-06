import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * 实例拦截器
 *
 * @export
 * @interface IRequestInterceptors
 */
export interface IRequestInterceptors {
  // 请求拦截
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (error: unknown) => unknown;

  // 响应拦截
  responseInterceptors?: <T>(config: AxiosResponse<T>) => AxiosResponse<T>;
  responseInterceptorsCatch?: (error: unknown) => unknown;
}

export interface IRequestConfig extends AxiosRequestConfig {
  interceptors?: IRequestInterceptors
}

export interface CancelRequestSource {
  [index: string]: () => void;
}

/**
 * 接口数据返回格式
 *
 * @export
 * @interface IResponse
 * @template D
 */
export interface IResponse<D> {
  Data: D
  DataNumber: number
  Message: string
  Status: number
  isSuccess: boolean
}
