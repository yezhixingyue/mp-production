/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ICatch { // 解决终端警告用
  response:AxiosResponse
  config:unknown,
}

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
  responseInterceptorsCatch?: (error: ICatch) => unknown;
}

export interface IRequestConfig extends AxiosRequestConfig {
  interceptors?: IRequestInterceptors
  /** 是否关闭全局loading */
  closeLoading?: boolean
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

export interface IMPAxiosInstance extends AxiosInstance {
  get<T = any, R = AxiosResponse<IResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<IResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = AxiosResponse<IResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<IResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}
