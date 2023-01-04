import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { InstanceLoginClass } from './InstanceLoginClass';

/**
 * 单个终端设备实例
 *
 * @export
 * @class TerminalEquipmentInstance
 */
export class TerminalEquipmentInstance {
  /** 账号与登录信息 */
  public loginData: InstanceLoginClass

  /** 设备信息 */
  public Equipment: IManageEquipmentInfo

  /** 记录滚动信息 切换后还原 */
  public scrollInfo = {
    left: 0,
    top: 0,
  }

  constructor(Equipment: IManageEquipmentInfo) {
    this.Equipment = Equipment;
    this.loginData = new InstanceLoginClass(Equipment.ID);
  }

  /** 替代调用loginData上的login方法 并 进行额外的任务数据获取处理 */
  public async login() {
    const result = await this.loginData.login();
    if (result) this.getTaskInfo();
  }

  /** 获取当前设备的任务信息 -- 触发时机: 1. 当切换至当前设备且当前设备未获取信息时  2. 登录成功后 */
  public getTaskInfo() {
    // 1. 在获取信息前, 先清除掉原有的任务信息
    console.log(this.loginData.token, 'getTaskInfo');
  }

  /** 机器报停 */
  public async reportStop(Reason: string, callback: () => void) {
    const temp = {
      EquipmentID: this.Equipment.ID,
      Reason,
    };
    const resp = await clientApi.getEquipmentStop(temp).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        // 1. 设置设备状态为报停状态

        // 2. 执行回调方法 关闭窗口
        callback();
      };
      MpMessage.success({ title: '报停成功', onOk: cb, onCancel: cb });
    }
  }
}
