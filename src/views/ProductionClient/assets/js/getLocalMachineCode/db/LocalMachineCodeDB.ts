import { IndexedDBStoreHandler } from './IndexedDB';

/**
 * 本机编码数据库表类型 id  key value
 *
 * @interface ILocalMachineCodeStoreType
 */
interface ILocalMachineCodeStoreType {
  id: number
  key: string
  value: string
  createTime: string
}

export class LocalMachineCodeDB extends IndexedDBStoreHandler<ILocalMachineCodeStoreType> {
  DBName = 'mp-production-client-indexedDB';

  Version = 1;

  storeName = 'local-machine-code-store';

  createStoreIndex() {
    if (!this.db) return;
    // 创建数据仓库（表）
    const objectStore = this.db.createObjectStore(this.storeName, {
      keyPath: 'id', // 这是主键
      autoIncrement: true, // 实现自增
    });
    // 创建索引，有了索引之后，查询速度大大增快（类比新华字典）
    objectStore.createIndex('id', 'id', { unique: true });
    objectStore.createIndex('key', 'key', { unique: false });
    objectStore.createIndex('value', 'value', { unique: false });
    objectStore.createIndex('createTime', 'createTime', { unique: false });
  }
}
