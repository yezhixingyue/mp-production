/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICoreOptions, IMpzjResponse, IRequestConfig, IRequestor, IResponseType, RequestMethod } from './types';
import { getController, getRequestHash, normalizeInstanceOptions, setLoading, setToken, getCatchErrorMsg, useReqConfNormalize } from './utils';
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
    this._options = normalizeInstanceOptions(options);
  }

  private _send<T>(config: IRequestConfig, hash: string) {
    setLoading('display', this._options, config); // 2. 展示loading

    const controller = getController(config); // 3. 设置controller

    const executor = new Promise<IResponseType<IMpzjResponse<T>>>((resolve, reject) => { // 4. 定义及执行Promise
      this._req.request(config)
        .then(resp => resolve(resp))
        .catch(err => reject(err));
    });

    this._requestPool.add({ hash, executor, controller }); // 5. 添加到请求池

    return executor;
  }

  private _afterSend<T>(config: IRequestConfig, hash: string, resp: IResponseType<IMpzjResponse<T>>) {
    setLoading('hidden', this._options, config); // 1. 隐藏loading

    this._requestPool.remove(hash); // 2. 从请求池中移出

    if (this._options.useResponse) { // 3. 交由报错勾子函数处理
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

      this._options.useResponse(resp, option);
    }
  }

  private _catchError(error: any, config: IRequestConfig, hash: string) {
    setLoading('hidden', this._options, config); // 1. 隐藏loading

    this._requestPool.remove(hash); // 2. 从请求池中移出

    const message = getCatchErrorMsg(error);

    if (this._options.useCatchError) this._options.useCatchError(message); // 3. 错误提示 --- 应使用传入的轻提示方法

    return message;
  }

  private async _requestCore<T = any, D = any>(config: IRequestConfig<D> & { method: RequestMethod }): Promise<IResponseType<IMpzjResponse<T>>> {
    // 合并参数
    useReqConfNormalize(config, this._options);

    const _hash = getRequestHash(config);

    // 1. 同时段重复请求处理
    const t = this._requestPool.list.find((it) => it.hash === _hash);
    if (t) {
      const resp = await t.executor.catch((err) => ({ message: getCatchErrorMsg(err) }));
      return resp;
    }

    // 2. 是否命中缓存
    if (config.cache) {
      const _cache = this._responseCache.get<T>(_hash);
      if (_cache) return _cache;
    }

    // 3. 请求幂等 - 某些接口需要严格控制不能多次请求时借助缓存进行处理 - 对其配置较长的缓存时间

    // 执行
    try {
      if (!setToken(config, this._options)) return { message: '未获取到token，请重新登录尝试' }; // 设置token
      if (this._options.beforeRequest) await this._options.beforeRequest(config); // 接口请求前函数

      const resp = await this._send<T>(config, _hash); // 发送

      this._afterSend(config, _hash, resp);

      if (config.cache && config.cache.isCacheable && config.cache.isCacheable(resp)) { // 缓存
        this._responseCache.add(_hash, resp, config.cache.duration);
      }

      return resp;
    } catch (error: any) {
      const message = this._catchError(error, config, _hash); // 错误处理
      return { message };
    }
  }

  private async _request<T = any, D = any>(config: IRequestConfig<D> & { method: RequestMethod }) {
    const resp = await this._requestCore<T, D>(config);

    if (resp && resp.data) {
      resp.data.isSuccess = this._options.isSuccess(resp);
      if (resp.status && resp.status !== 200) {
        resp.message = `错误代码：${resp.status}`; // 是否使用 config.tipTitle ?
      }
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
