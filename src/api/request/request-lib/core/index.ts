/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICoreOptions, IMpzjResponse, IRequestConfig, IRequestor, IResponseType, RequestMethod } from './types';
import { getController, getRequestHash, verifyStatus, normalizeOptions, setLoading, setToken, normalizeCacheOptions } from './utils';
import { RequestPool } from './requestPool';
import { ResponseCache } from './responseCache';

export class RequestCore { // ------------------ 需要继续精简
  private _req: IRequestor

  private _options: ICoreOptions

  private _requestPool = new RequestPool() // 请求池

  private _responseCache = new ResponseCache() // 缓存池

  constructor(requestor: IRequestor, options: ICoreOptions) {
    if (!requestor) {
      throw new Error('The requestor method is not injected into request-core!');
    }

    this._req = requestor;
    this._options = normalizeOptions(options);
  }

  private async _requestCore<T = any, D = any>(config: IRequestConfig<D> & { method: RequestMethod }) {
    const _hash = getRequestHash(config);

    // 1. 请求池是否重复
    const t = this._requestPool.list.find((it) => it.hash === _hash);
    if (t) {
      const resp = await t.requester.catch(() => null) as IResponseType<IMpzjResponse<T>> | null;
      return resp && verifyStatus(resp.status, this._options.validStatuses) ? resp : null;
    }

    // 2. 是否命中缓存
    const _cacheConfig = normalizeCacheOptions(config, this._options);
    if (_cacheConfig) {
      // 取缓存
      const _cache = this._responseCache.get<T>(_hash);
      if (_cache) return _cache;
    }

    // 3. 执行请求
    try {
      // --------------------------  执行前 [ 前面2步或许可以提到外面 - 以提供勾子函数的方式 ]
      if (!setToken(config, this._options)) return null; // 1. 设置token

      setLoading('display', this._options, config); // 2. 展示loading

      const controller = getController(config); // 3. 设置controller

      const requester = new Promise<IResponseType<IMpzjResponse<T>>>((resolve, reject) => { // 4. 定义及执行Promise
        this._req.request(config)
          .then(resp => resolve(resp))
          .catch(err => reject(err));
      });

      this._requestPool.add({ hash: _hash, requester, controller }); // 5. 添加到请求池

      const resp = await requester; // 6. 等待结果

      // --------------------------  执行后
      setLoading('hidden', this._options, config); // 1. 隐藏loading

      this._requestPool.remove(_hash); // 2. 从请求池中移出

      if (this._options.useResponseMessage) { // 3. 交由报错勾子函数处理
        const option = {
          clear: () => { // 清空所有状态 -- 1. 所有请求  2. 全局loading  3. 全部缓存数据
            this._requestPool.clear();
            this._responseCache.clear();
            setLoading('clear', this._options);
          },
          msgCallback: config.msgCallback,
          closeTip: config.closeTip === true, // 是否不展示错误提示
          tipTitle: config.tipTitle,
        };

        this._options.useResponseMessage(resp, option);
      }

      // 4. 根据需要看是否缓存结果 --- 1. 看是否设置需要缓存（配置选项?）  2. 看当前结果是否有效可缓存（目前暂定200 和 1000）
      if (_cacheConfig && _cacheConfig.isCacheable(resp)) {
        // 进行缓存
        this._responseCache.add(_hash, resp, _cacheConfig);
      }

      return verifyStatus(resp.status, this._options.validStatuses) ? resp : null; // 默认仅第一层status为200时才返回数据 否则返回null
    } catch (error: any) { // 错误捕获
      setLoading('hidden', this._options, config); // 1. 隐藏loading

      this._requestPool.remove(_hash); // 2. 从请求池中移出

      let message = error && error.message ? error.message : '';

      if (message === 'Network Error') {
        message = '网络错误';
      } else if (message && message.includes('timeout')) {
        message = '网络超时';
      }

      if (this._options.useRequestCatchError) this._options.useRequestCatchError(message); // 3. 错误提示 --- 应使用传入的轻提示方法

      return null;
    }
  }

  private async _request<T = any, D = any>(config: IRequestConfig<D> & { method: RequestMethod }) {
    const resp = await this._requestCore<T, D>(config);

    if (resp) {
      resp.data.isSuccess = this._options.isSuccess(resp);
    }

    return resp;
  }

  get<T = any, D = any>(url: string, config?: IRequestConfig<D>) {
    return this._request<T, D>({ ...(config || {}), url, method: 'GET' });
  }

  post<T = any, D = any>(url: string, data?: D, config?: IRequestConfig<D>) {
    return this._request<T, D>({ ...(config || {}), url, data, method: 'POST' });
  }

  put<T = any, D = any>(url: string, data?: D, config?: IRequestConfig<D>) {
    return this._request<T, D>({ ...(config || {}), url, data, method: 'PUT' });
  }

  delete<T = any, D = any>(url: string, config?: IRequestConfig<D>) {
    return this._request<T, D>({ ...(config || {}), url, method: 'DELETE' });
  }

  request<T = any, D = any>(config: IRequestConfig<D> & { method: RequestMethod }) {
    return this._request<T, D>(config);
  }
}
