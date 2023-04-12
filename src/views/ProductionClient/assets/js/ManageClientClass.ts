import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { getLocalMachineCode } from './getLocalMachineCode';
import { SessionStorageClientHandler } from './SessionStorageHandler';
import { TerminalEquipmentInstance } from './Instance';
import { WebsocketHandler } from '../../Comps/EquipmentPageContent/FloatingBall/WebsocketHandler';

/**
 * 生产报工页面数据
 *
 * @export
 * @class ManageClientClass
 */
export class ManageClientClass {
  /** 机器实例列表 */
  public InstanceList: TerminalEquipmentInstance[] = []

  /** 当前终端绑定的设备列表 */
  public TerminalEquipmentList: IManageEquipmentInfo[] = []

  public loading = false

  /** 当前正在处于激活状态的机器实例 */
  public curActiveInstance: null | TerminalEquipmentInstance = null

  /** websocket通信获取到的未送出工单信息（小球展示内容数据） */
  websocketHandler: WebsocketHandler = new WebsocketHandler()

  /** 获取当前终端设备列表 */
  public async getTerminalEquipmentList() {
    this.loading = true;
    try {
      const terminal = await getLocalMachineCode();

      const resp = await clientApi.getTerminalEquipmentList(terminal).catch(() => null);

      this.loading = false;

      if (resp?.data.isSuccess) {
        this.setTerminalEquipmentList(resp.data.Data);
      }
    } catch (error) {
      this.loading = false;
      MpMessage.error({ title: '错误', msg: '获取绑定设备失败' });
    }
  }

  /** 设置当前客户端绑定的设备列表 - 可在设置的同时 进行其它方面的处理 -- 根据该列表 生成每台设备实例列表（清除原登录状态? - 暂不清除） */
  public async setTerminalEquipmentList(list: IManageEquipmentInfo[]) {
    this.TerminalEquipmentList = list.map(it => this.TerminalEquipmentList.find(_it => _it.ID === it.ID) || it);

    this.InstanceList = list.map(it => this.InstanceList.find(_it => _it.Equipment.ID === it.ID) || new TerminalEquipmentInstance(it));

    this.websocketHandler.getAllUndeliveredList(); // 更新设备信息

    // 对curActiveInstance的相关处理 -- 如果当前实例被移除 则置curActiveInstance为null
    if (this.curActiveInstance) {
      const t = this.InstanceList.find(it => it.Equipment.ID === this.curActiveInstance?.Equipment.ID);
      if (!t) this.curActiveInstance = null;
    }

    /** 只保留当前存在设备的缓存信息 */
    if (list.length > 0) SessionStorageClientHandler.filterNonexistence(list.map(it => it.ID));
  }
}
