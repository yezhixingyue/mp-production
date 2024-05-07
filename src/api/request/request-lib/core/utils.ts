import SparkMD5 from 'spark-md5';
import { ICoreOptions, IRequestConfig } from './types';

/** 参数归一化 */
export const normalizeOptions = (options: ICoreOptions) => {
  const validStatuses = options?.validStatuses || [200];

  const _temp = {
    validStatuses,
  };

  return { ...options || {}, ..._temp };
};

/** 统一cache选项配置 */
export const normalizeCacheOptions = (requestConfig: IRequestConfig, options: ICoreOptions) => {
  const _cacheConfig = requestConfig.cache || options.cache;
  if (_cacheConfig && _cacheConfig.duration > 0) {
    const isCacheable = requestConfig.cache?.isCacheable || options.cache?.isCacheable;
    if (isCacheable) {
      return { ..._cacheConfig, isCacheable };
    }
  }

  return undefined;
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
