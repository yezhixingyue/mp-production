/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SparkMD5 from 'spark-md5';
import type { ICoreOptions, IRequestConfig } from './types';

/** 参数归一化 */
export const normalizeInstanceOptions = (options: ICoreOptions): ICoreOptions => {
  const validStatuses = options.validStatuses || [200];

  const _temp = {
    validStatuses,
  };

  return { ...options || {}, ..._temp };
};

const _normalizeCacheOptions = (config: IRequestConfig, options: ICoreOptions) => {
  let _cacheConfig = config.cache || options.cache;

  if (config.idempotent) { // 如果开启了请求幂等
    const duration = 1 * 60 * 60 * 1000; // 默认1小时内重复提交使用缓存
    if (_cacheConfig) _cacheConfig.duration = duration;
    else _cacheConfig = { duration };
  }

  if (_cacheConfig && _cacheConfig.duration > 0) {
    const isCacheable = config.cache?.isCacheable || options.cache?.isCacheable;
    if (isCacheable) {
      return { ..._cacheConfig, isCacheable };
    }
  }

  return undefined;
};

/** 请求config配置参数归一化 */
export const useReqConfNormalize = (config: IRequestConfig, options: ICoreOptions) => {
  if (config.baseURL === undefined && options.baseURL) { // 归一化baseURL
    config.baseURL = options.baseURL;
  }
  config.cache = _normalizeCacheOptions(config, options); // 归一化cache选项配置
  // ... 后续可能会补充更多配置
};

/** 使用请求信息获取hash字符串 */
export const getRequestHash = (config: IRequestConfig) => {
  const spark = new SparkMD5();

  Object.entries(config).forEach(([key, value]) => {
    spark.append(key);
    spark.append(JSON.stringify(value) || '');
  });
  return spark.end();
};

/** 设置token */
export const setToken = (config: IRequestConfig, _options?: ICoreOptions) => {
  if (_options && config.withoutToken !== true) {
    if (_options.setToken) return _options.setToken(config);

    if (_options.getToken) { // 需要设置token
      const token = _options.getToken();
      if (!token) {
        return false; // 但未获取到token
      }

      const _config = config;
      if (!_config.headers) _config.headers = {};
      _config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return true;
};

/** 设置loading */
export const setLoading = (type: 'display' | 'hidden' | 'clear', _options: ICoreOptions, config?: IRequestConfig) => {
  if (_options.loadingHandler) {
    switch (type) {
      case 'display':
        if (config && config.loading !== false) _options.loadingHandler.display();
        break;

      case 'hidden':
        if (config && config.loading !== false) _options.loadingHandler.hidden();
        break;

      case 'clear':
        _options.loadingHandler.hiddenByForce();
        break;

      default:
        break;
    }
  }
};

/** 设置可用于取消的controller */
export const getController = (config: IRequestConfig) => {
  const _config = config;

  const controller = new AbortController();
  _config.signal = controller.signal;

  return controller;
};

/** 对响应结果进行筛选 仅符合指定要求时返回响应数据 - 默认为status为200时返回数据 其它状态返回null */
export const verifyStatus = (status: number, statuses: number[]) => statuses.includes(status);

export const getCatchErrorMsg = (error: any) => {
  let message = error && error.message ? error.message : '';

  if (message === 'Network Error') {
    message = '网络错误';
  } else if (message && message.includes('timeout')) {
    message = '网络超时';
  }

  return message;
};
