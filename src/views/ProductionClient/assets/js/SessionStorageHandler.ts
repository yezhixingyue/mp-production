import { IUser } from '@/store/modules/user/types';

interface IClientSessionStorageType {
  token: string
  user: IUser | null
  EquipmentID: string
  mobileOnSuccess?: string // 登录成功后使用的手机号
}

const SessionStorageKEY = 'production-client-storage-data';

/**
 * 主要用于报工页面token、用户信息的缓存处理
 *
 * @export
 * @class SessionStorageClientHandler
 */
export class SessionStorageClientHandler {
  // 函数重载
  static getData(EquipmentID: string): IClientSessionStorageType | null

  static getData(): IClientSessionStorageType[] | null

  /** 获取缓存数据  传入EquipmentID返回该条目数据 否则返回列表数据  结果可为null */
  static getData(EquipmentID?: string) {
    const data = sessionStorage.getItem(SessionStorageKEY);
    if (!data) return null;
    const list = JSON.parse(data) as IClientSessionStorageType[];

    if (!EquipmentID) return list;

    return list.find(it => it.EquipmentID === EquipmentID) || null;
  }

  /** 设置缓存数据  其中user可为null  在登录成功 或 获取到用户数据后可使用该方法进行数据更新 */
  static setData(item: IClientSessionStorageType) {
    const _list = this.getData() || [];

    const list = _list.filter(it => it.EquipmentID !== item.EquipmentID);

    const temp = { ...item };
    list.push(temp);

    sessionStorage.setItem(SessionStorageKEY, JSON.stringify(list));
  }

  /** 获取缓存的user数据 */
  static getUser(EquipmentID: string) {
    const data = this.getData(EquipmentID);

    return data?.user || null;
  }

  /** 清除一个用户 注销时使用 */
  static clearItem(EquipmentID: string) {
    const _list = this.getData() || [];

    const list = _list.filter(it => it.EquipmentID !== EquipmentID);

    sessionStorage.setItem(SessionStorageKEY, JSON.stringify(list));
  }

  /** 清除掉不存在的设备的相关缓存信息 -- 用于设置过机器后 清除掉被删除的机器相关缓存信息  ids为当前存在设备的id列表 */
  static filterNonexistence(ids: string[]) {
    const _list = this.getData() || [];

    const list = _list.filter(it => ids.includes(it.EquipmentID));

    sessionStorage.setItem(SessionStorageKEY, JSON.stringify(list));
  }
}
