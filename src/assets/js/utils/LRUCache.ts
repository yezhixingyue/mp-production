export default class LRUCache {
  length: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Map<string, any>;

  constructor(lenght: number) {
    this.length = lenght; // 存储长度
    this.data = new Map(); // 存储数据
  }

  /** 存储数据，通过键值对的方式 */
  set(key: string, value) {
    const { data } = this;
    if (data.has(key)) {
      data.delete(key);
    }
    data.set(key, value);

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

    const value = data.get(key); // 获取元素
    data.delete(key); // 删除元素
    data.set(key, value); // 重新插入元素

    return value;
  }
}
