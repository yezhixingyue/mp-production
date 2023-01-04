import { v4 as uuidv4 } from 'uuid';
import { SessionStorageClientHandler } from '../SessionStorageHandler';
import { LocalMachineCodeDB } from './db/LocalMachineCodeDB';

const localMachineCodeDB = new LocalMachineCodeDB();

/**
 * 生成设备编码
 *
 * @returns
 */
export const createLocalMachineCode = async () => {
  const code = uuidv4();

  await localMachineCodeDB.openDB();
  localMachineCodeDB.addItem({ key: 'local-machine-code', value: code });
  localMachineCodeDB.closeDB();

  return code;
};

/**
 * 获取设备编码 （如果原本没有，则会使用uuid自动生成一个 - 此处根据需要可不生成）
 *
 * @returns
 */
export const getLocalMachineCode = async () => {
  await localMachineCodeDB.openDB();

  const result = await localMachineCodeDB.getDataByIndex('key', 'local-machine-code').catch(() => null);

  localMachineCodeDB.closeDB();

  let code = '';

  if (result?.data) {
    code = result.data.value;
  } else {
    code = await createLocalMachineCode();
    // 在生成新的设备编码的时候 清除掉原有全部的缓存信息
    SessionStorageClientHandler.filterNonexistence([]);
  }

  return code;
};
