/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IMpzjResponse, IResponseType } from './types';

interface IResponseCacheItem<T = any> {
  hash: string
  /** 到期时间 时间戳 */
  expires: number
  response: IResponseType<IMpzjResponse<T>>
}

export class ResponseCache {
  private _map = new Map<string, IResponseCacheItem>()

  private _length = 20

  /** 清理过期及超长项目 */
  private _clean() {
    // 1. 清理过期项目
    Array.from(this._map.entries()).forEach(([key, item]) => {
      if (typeof item.expires === 'number' && item.expires > 0 && Date.now() > new Date(item.expires).getTime()) { // 过时
        this._map.delete(key); // 删除元素
      }
    });

    // 2. 清理超长项目
    if (this._map.size > this._length) {
      const delKey = this._map.keys().next().value; // 获取map中的第一个键值对中的key值 （默认第一个为最久的数据， 新加数据在最后面）
      if (delKey && this._map.has(delKey)) this._map.delete(delKey);
    }
  }

  add(hash: string, response: IResponseType<IMpzjResponse>, duration: number) {
    const expires = Date.now() + duration;

    const temp = {
      hash,
      response,
      expires,
    };

    this._map.set(temp.hash, temp);

    this._clean();
  }

  get<T>(hash: string) {
    if (!this._map.has(hash)) { // 未找到
      return null;
    }

    const target = this._map.get(hash); // 获取元素

    if (!target) return null;

    this._map.delete(hash); // 删除元素

    if (typeof target.expires === 'number' && target.expires > 0 && Date.now() > new Date(target.expires).getTime()) { // 过时
      return null;
    }

    this._map.set(hash, target); // 重新插入元素

    return target.response as IResponseType<IMpzjResponse<T>>;
  }

  /** 清除全部缓存数据 */
  clear() {
    this._map.clear();
  }
}
