interface ITtemType<T> {
  value: T,
  expires: number,
}

export default class LRUCache<T> {
  length: number;

  data: Map<string, ITtemType<T>>;

  constructor(lenght: number) {
    this.length = lenght; // 存储长度
    this.data = new Map(); // 存储数据
  }

  /** 存储数据，通过键值对的方式   expires 应传递预期过期时间的时间戳 */
  set(key: string, value: T, expires = 0) {
    const { data } = this;
    if (data.has(key)) {
      data.delete(key);
    }
    data.set(key, { value, expires });

    this.clearExpiredItems();

    if (data.size > this.length) { // 如果超出了容量，则需要删除最久的数据
      const delKey = data.keys().next().value; // 获取map中的第一个键值对中的key值 （默认第一个为最久的数据， 新加数据在最后面）
      data.delete(delKey);
    }
  }

  /** 获取数据 */
  get(key: string) {
    const { data } = this;

    if (!data.has(key)) { // 未找到
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const target = data.get(key)!; // 获取元素

    if (typeof target.expires === 'number' && target.expires > 0 && Date.now() > new Date(target.expires).getTime()) { // 过时
      data.delete(key); // 删除元素
      return null;
    }

    data.delete(key); // 删除元素
    data.set(key, target); // 重新插入元素

    return target.value;
  }

  /** 清除过期项 */
  private clearExpiredItems() {
    [...this.data.entries()].forEach(([key, item]) => {
      if (typeof item.expires === 'number' && item.expires > 0 && Date.now() > new Date(item.expires).getTime()) { // 过时
        this.data.delete(key); // 删除元素
      }
    });
  }
}
