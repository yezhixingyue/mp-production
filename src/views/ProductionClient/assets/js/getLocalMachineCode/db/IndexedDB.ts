import type { IIndexedDBResponse } from './type';

/**
 * Indexed处理函数类 - 用于管理客户端唯一标识
 *
 * @export
 * @class IndexedDBStoreHandler
 */
export abstract class IndexedDBStoreHandler<T> {
  abstract DBName: string

  abstract Version: number

  abstract storeName: string

  db: IDBDatabase | null = null;

  /**
   * 数据库表初始化
   *
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  abstract createStoreIndex():void

  /**
   * 打开数据库
   *
   * @memberof IndexedDBStoreHandler
   */
  openDB(): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      // 打开数据库，如果没有就是创建操作
      const request = indexedDB.open(this.DBName, this.Version);

      // 数据库打开或者创建成功的时候
      request.onsuccess = () => {
        this.db = request.result;
        resolve({
          status: true,
          message: '数据库打开成功',
          data: null,
        });
      };

      // 打开失败
      request.onerror = () => {
        reject(new Error('数据库打开失败'));
      };

      // 数据库发生更新的时候
      // 1. 版本号更新  2. 添加或者删除了表（对象仓库）的时候
      // 当我们第一次调用 open 方法时，会触发这个事件
      // 我们在这里来初始化我们的表
      request.onupgradeneeded = () => {
        if (!this.db) this.db = request.result;

        // 数据库初始化
        this.createStoreIndex();
      };
    });
  }

  /**
   * 关闭数据库
   *
   * @memberof IndexedDBStoreHandler
   */
  closeDB() {
    if (this.db) this.db.close();
  }

  /**
   * 删除整个数据库 -- 必须在关闭连接的状态下才可删除
   *
   * @returns {Promise<IIndexedDBResponse>}
   * @memberof IndexedDBStoreHandler
   */
  deleteDBAll(): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      const deleteRequest = window.indexedDB.deleteDatabase(this.DBName);

      deleteRequest.onblocked = () => {
        reject(new Error('删除正被阻塞中'));
      };

      deleteRequest.onerror = () => {
        reject(new Error('删除失败'));
      };

      deleteRequest.onsuccess = () => {
        this.db = null;
        resolve({
          status: true,
          message: '删除成功',
          data: null,
        });
      };
    });
  }

  /**
   * 添加本机设备编码
   *
   * @param {T} data
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  addItem(data: Partial<T>): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .add(data);

      request.onsuccess = () => {
        resolve({
          status: true,
          message: '写入成功',
          data: null,
        });
      };

      request.onerror = () => {
        reject(new Error('数据写入失败'));
      };
    });
  }

  /**
   * 通过主键来读取数据
   *
   * @param {number} key
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  getDataByKey(key: number): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }
      const request = this.db.transaction([this.storeName])
        .objectStore(this.storeName)
        .get(key);

      request.onsuccess = () => {
        resolve({
          status: true,
          message: '数据查询成功',
          data: request.result,
        });
      };

      request.onerror = () => {
        reject(new Error('数据查询失败'));
      };
    });
  }

  /**
   * 获取该表内的所有数据
   *
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  getAllData(): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }
      const request = this.db.transaction([this.storeName])
        .objectStore(this.storeName)
        .getAll();

      request.onsuccess = () => {
        resolve({
          status: true,
          message: '数据查询成功',
          data: request.result,
        });
      };

      request.onerror = () => {
        reject(new Error('数据查询失败'));
      };
    });
  }

  /**
   * 使用游标（指针）获取表内所有数据
   *
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  cursorGetData(): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const list: T[] = []; // 用于存放所有的数据
      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .openCursor(); // 创建一个指针（游标）

      request.onsuccess = () => {
        const cursor = request.result;
        // 查看游标（指针）有没有返回一条数据
        if (cursor) {
          list.push(cursor.value);
          cursor.continue(); // 移动到下一条数据
        } else {
          resolve({
            status: true,
            message: '数据查询成功',
            data: list,
          });
        }
      };

      request.onerror = () => {
        reject(new Error('数据查询失败'));
      };
    });
  }

  /**
   * 通过索引来查询数据（只会返回一条）
   * 如：indexName: key, indexValue: age
   *
   * @param {string} indexName
   * @param {string} indexValue
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  getDataByIndex(indexName: string, indexValue: string): Promise<IIndexedDBResponse<T>> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }
      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .index(indexName)
        .get(indexValue);

      request.onsuccess = () => {
        resolve({
          status: true,
          message: '数据查询成功',
          data: request.result,
        });
      };

      request.onerror = () => {
        reject(new Error('数据查询失败'));
      };
    });
  }

  /**
   * 根据索引和游标来查询数据 -- 可查出所有
   *
   * @param {string} indexName
   * @param {string} indexValue
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  getDataByIndexAndCursor(indexName: string, indexValue: string): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const list: T[] = []; // 存储所有满足条件的数据
      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .index(indexName)
        .openCursor(IDBKeyRange.only(indexValue));
      /** 关于指针查询IDBKeyRange上的类型：
       *  IDBKeyRange.lowerBound( )：指定下限。

          IDBKeyRange.upperBound( )：指定上限。

          IDBKeyRange.bound( )：同时指定上下限。

          IDBKeyRange.only( )：指定只包含一个值。

          示例：

          // All keys ≤ x
          var r1 = IDBKeyRange.upperBound(x);

          // All keys < x
          var r2 = IDBKeyRange.upperBound(x, true);

          // All keys ≥ y
          var r3 = IDBKeyRange.lowerBound(y);

          // All keys > y
          var r4 = IDBKeyRange.lowerBound(y, true);

          // All keys ≥ x && ≤ y
          var r5 = IDBKeyRange.bound(x, y);

          // All keys > x &&< y
          var r6 = IDBKeyRange.bound(x, y, true, true);

          // All keys > x && ≤ y
          var r7 = IDBKeyRange.bound(x, y, true, false);

          // All keys ≥ x &&< y
          var r8 = IDBKeyRange.bound(x, y, false, true);

          // The key = z
          var r9 = IDBKeyRange.only(z);
       */

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          list.push(cursor.value);
          cursor.continue();
        } else {
          resolve({
            status: true,
            message: '数据查询成功',
            data: list,
          });
        }
      };

      request.onerror = () => {
        reject(new Error('数据查询失败'));
      };
    });
  }

  /**
   * 通过索引和游标分页查询数据
   *
   * @param {string} indexName
   * @param {string} indexValue
   * @param {number} [page=1]
   * @param {number} [pageSize=20]
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  cursorGetDataByIndexAndPage(
    indexName: string,
    indexValue: string,
    page = 1,
    pageSize = 20,
  ): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const list: T[] = []; // 用于存储当前页的分页数据
      let counter = 0; // 创建一个计数器
      let isPass = true; // 是否要跳过数据
      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .index(indexName)
        .openCursor(IDBKeyRange.only(indexValue)); // 创建一个指针（游标）对象（目前是指向第一条数据）
      request.onsuccess = () => {
        let cursor = request.result;
        // 接下来有一个很重要的判断，判断是否要跳过一些数据
        if (page > 1 && isPass) {
          isPass = false;
          if (cursor) cursor.advance((page - 1) * pageSize); // 跳过数据
          return;
        }
        if (cursor) {
          list.push(cursor.value);
          counter += 1;
          if (counter < pageSize) {
            cursor.continue();
          } else {
            cursor = null;
            resolve({
              status: true,
              message: '数据查询成功',
              data: list,
            });
          }
        } else {
          resolve({
            status: true,
            message: '数据查询成功',
            data: list,
          });
        }
      };

      request.onerror = () => {
        reject(new Error('数据查询失败'));
      };
    });
  }

  /**
   * 更新数据条目
   *
   * @param {T} data
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  updateDB(data: T): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .put(data);
      request.onsuccess = () => {
        resolve({
          status: true,
          message: '更新数据成功',
          data: null,
        });
      };

      request.onerror = () => {
        reject(new Error('数据更新失败'));
      };
    });
  }

  /**
   * 通过主键删除数据
   *
   * @param {number} id
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  deleteDB(id: number): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const request = this.db
        .transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .delete(id);

      request.onsuccess = () => {
        resolve({
          status: true,
          message: '删除数据成功',
          data: null,
        });
      };

      request.onerror = () => {
        reject(new Error('删除数据失败'));
      };
    });
  }

  /**
   * 通过索引和游标删除指定的数据
   *
   * @param {string} indexName
   * @param {string} indexValue
   * @returns
   * @memberof IndexedDBStoreHandler
   */
  cursorDelete(indexName: string, indexValue: string): Promise<IIndexedDBResponse> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'));
        return;
      }

      const request = this.db.transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
        .index(indexName)
        .openCursor(IDBKeyRange.only(indexValue));

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const deleteRequest = cursor.delete();
          deleteRequest.onsuccess = () => {
            resolve({
              status: true,
              message: '删除数据成功',
              data: null,
            });
          };
          cursor.continue();
        }
      };

      request.onerror = () => {
        reject(new Error('删除数据失败'));
      };
    });
  }
}
