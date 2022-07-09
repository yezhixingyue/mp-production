/* eslint-disable no-param-reassign */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import type {
  CancelRequestSource, IRequestConfig, IRequestInterceptors, IResponse,
} from './types';

class AxiosClass {
  // axios实例
  instance: AxiosInstance

  // 拦截器对象
  interceptorsObj?: IRequestInterceptors

  /*
  存放取消方法的集合
  *
  * 在创建请求后将取消请求方法 push 到该集合中
  * 封装一个方法，可以取消请求，传入 url: string|string[]
  * 在请求之前判断同一URL是否存在，如果存在就取消请求
  */
  cancelRequestSourceList: CancelRequestSource[]

  /*
  存放所有请求URL的集合
  *
  * 请求之前需要将url push到该集合中
  * 请求完毕后将url从集合中删除
  * 添加在发送请求之前完成，删除在响应之后删除
  */
  requestUrlList: string[]

  constructor(data?: IRequestConfig) {
    this.requestUrlList = [];
    this.cancelRequestSourceList = [];

    this.instance = axios.create(data);
    this.interceptorsObj = data?.interceptors;

    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => config,
      error => Promise.reject(error),
    );

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch,
    );
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch,
    );

    // 全局响应拦截器放到最后位置 保证最后执行 --- 在结果中添加一字段isSuccess用于指明该结果是否成功返回
    this.instance.interceptors.response.use(
      (response: AxiosResponse<IResponse<unknown>>) => {
        if (response.data?.Status === 1000) {
          response.data.isSuccess = true;
        } else {
          response.data.isSuccess = false;
        }
        return response;
      },
      error => Promise.reject(error),
    );
    // 拦截器的执行顺序为实例请求→类请求→实例响应→类响应
  }

  request<T>(config: IRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config);
      }
      const _fullUrl = AxiosClass.getFullUrlByQs(config);
      if (_fullUrl) this.cancelRequest(_fullUrl); // 执行当次请求时 先检查并取消上次未结束的相同请求
      this.recordUrl(config);
      this.instance.request<T>(config)
        .then((res) => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors<T>(res);
          }

          resolve(res);
        })
        .catch((err: unknown) => { reject(err); })
        .finally(() => { this.delUrl(_fullUrl); });
    });
  }

  /**
   * 记录请求
   * @param config
   */
  private recordUrl(config: AxiosRequestConfig) {
    const _fullUrl = AxiosClass.getFullUrlByQs(config);
    if (_fullUrl) {
      this.requestUrlList.push(_fullUrl);
      config.cancelToken = new axios.CancelToken(c => {
        this.cancelRequestSourceList.push({
          [_fullUrl]: c,
        });
      });
    }
  }

  private getSourceIndex(_fullUrl: string): number {
    const i = this.cancelRequestSourceList.findIndex(
      (item: CancelRequestSource) => Object.keys(item)[0] === _fullUrl,
    );
    return typeof i === 'number' ? i : -1;
  }

  /**
   * @description: 删除 requestUrlList和 cancelRequestSourceList   * @param {string} _fullUrl
   * @returns {*}
   */
  private delUrl(_fullUrl?: string): void {
    if (!_fullUrl || (this.requestUrlList.length === 0 && this.requestUrlList.length === 0)) return;
    const urlIndex = this.requestUrlList.findIndex(u => u === _fullUrl);
    const sourceIndex = this.getSourceIndex(_fullUrl);
    // 删除url和cancel方法
    if (typeof urlIndex === 'number' && urlIndex > -1) {
      this.requestUrlList.splice(urlIndex, 1);
    }
    if (sourceIndex > -1) {
      this.cancelRequestSourceList.splice(sourceIndex, 1);
    }
  }

  /**
   * 取消全部请求
   *
   * @memberof AxiosClass
   */
  cancelAllRequest() {
    this.cancelRequestSourceList.forEach(source => {
      const key = Object.keys(source)[0];
      console.log(key, source[key]);
      source[key]();
    });
    this.cancelRequestSourceList = [];
    this.requestUrlList = [];
  }

  /**
   * 取消单个或多个请求
   *
   * @param {(string | string[])} _fullUrl
   * @memberof AxiosClass
   */
  cancelRequest(_fullUrl: string | string[]) {
    if (typeof _fullUrl === 'string') {
      // 取消单个请求
      const sourceIndex = this.getSourceIndex(_fullUrl);
      if (sourceIndex > -1) {
        this.cancelRequestSourceList[sourceIndex][_fullUrl]();
        this.delUrl(_fullUrl);
      }
    } else {
      // 存在多个需要取消请求的地址
      _fullUrl.forEach(u => {
        const sourceIndex = this.getSourceIndex(u);
        if (sourceIndex > -1) {
          this.cancelRequestSourceList[sourceIndex][u]();
          this.delUrl(u);
        }
      });
    }
  }

  private static getFullUrlByQs(config: AxiosRequestConfig) {
    const {
      method, url, params, data,
    } = config;
    // qs.stringify 作用：  {name:'hehe',age:10}   =>  name=hehe&age=10   和 JSON.stringify完全不同
    return [method, url, qs.stringify(params), qs.stringify(data)].join('&');
  }
}

export default AxiosClass;
