/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRequestPoolItem } from './types';

export class RequestPool {
  list: IRequestPoolItem[] = []

  add(item: IRequestPoolItem) {
    this.list.push(item);
  }

  remove(hash: string) {
    this.list = this.list.filter(it => it.hash !== hash);
  }

  /** 取消所有请求 且 清空请求池 */
  clear() {
    this.list.forEach(it => it.controller.abort());
    this.list = [];
  }
}
