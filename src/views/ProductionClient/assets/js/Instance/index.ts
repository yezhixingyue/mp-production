import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentStatusEnum } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/enum';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { IEquipmentErrorInfo, IEquipmentTaskInfo } from '../types';
import { InstanceLoginClass } from './InstanceLoginClass';
import { InstanceTaskListClass } from './InstanceTaskListClass/InstanceTaskListClass';

/**
 * 单个终端设备实例
 *
 * @export
 * @class TerminalEquipmentInstance
 */
export class TerminalEquipmentInstance {
  /** 账号与登录信息 */
  public loginData: Required<InstanceLoginClass>

  /** 设备信息 */
  public Equipment: IManageEquipmentInfo

  /** 设备错误信息 - 当设备为报停状态下有数据且需要使用 */
  public ErrorInfo: IEquipmentErrorInfo | null = null

  /** 当前任务信息 */
  public curTaskData: null | IEquipmentTaskInfo = null

  /** 当前任务信息是否已获取完成 --- 如果已获取完成且当前任务为空的情况下 在页面上进行针对处理 */
  public isCurTaskLoading = false

  /** 任务列表相关类 */
  public TaskListData: InstanceTaskListClass

  /** 记录滚动信息 切换后还原 */
  public scrollInfo = {
    left: 0,
    top: 0,
  }

  constructor(Equipment: IManageEquipmentInfo) {
    this.Equipment = Equipment;
    this.loginData = new InstanceLoginClass(Equipment.ID);
    this.TaskListData = new InstanceTaskListClass(Equipment);
  }

  /** 设备组名称 + 设备名称 组合起来的显示文字名称 */
  public get EquipmentDisplayName() {
    return (this.Equipment.GroupName ? `${this.Equipment.GroupName}-` : '') + this.Equipment.Name;
  }

  /** 替代调用loginData上的login方法 并 进行额外的任务数据获取处理 */
  public async login() {
    const result = await this.loginData.login();
    if (result) {
      this.getTaskInfo();
    }
  }

  public async logout() {
    const bool = await this.loginData.logout();
    if (bool) this.curTaskData = null;
  }

  /** 当该实例切换至激活状态时所要处理的一些内容 */
  switchToActive() {
    if (!this.curTaskData && this.loginData.token && this.Equipment.ID) { // 如果已登录但未获取任务信息则执行
      this.getTaskInfo();
    }
  }

  /** 扫码枪扫描条码 进行送达操作 */
  public getEquipmentReceive = async (Code: string, cb) => {
    const temp = {
      EquipmentID: this.Equipment.ID,
      Code,
    };
    const resp = await clientApi.getEquipmentReceive(temp, cb).catch(() => null);
    if (resp?.data.isSuccess) {
      return resp.data.Data;
    }
    return null;
  }

  /** 当设备为报停状态时 获取到具体的报停错误信息 */
  private async getErrorInfo() {
    if (this.ErrorInfo) return;
    const resp = await clientApi.getErrorEquipmentTask(this.Equipment.ID).catch(() => null);
    if (resp?.data.isSuccess) {
      this.ErrorInfo = resp.data.Data;
    }
  }

  /** 获取当前设备的任务信息 -- 触发时机: 1. 当切换至当前设备且当前设备未获取信息时  2. 登录成功后 */
  public async getTaskInfo() {
    // 0. 当机器报停的时候不再获取
    if (this.Equipment.Status === EquipmentStatusEnum.failure) {
      // 此处获取错误数据
      this.getErrorInfo();
      return;
    }

    // 1. 初始化 - 清除掉原有的任务信息
    this.curTaskData = null;

    // 2. 获取数据
    this.isCurTaskLoading = true;
    const resp = await clientApi.getEquipmentStartTask(this.Equipment.ID).catch(() => null);
    this.isCurTaskLoading = false;

    // 3. 处理
    if (resp?.data.isSuccess) {
      this.curTaskData = resp.data.Data;
      this.TaskListData.getEquipmentTaskList();
    }
  }

  /** 机器报停 */
  public async getEquipmentStop(Reason: string) {
    const temp = {
      ID: this.Equipment.ID,
      Remark: Reason,
    };
    const resp = await clientApi.getEquipmentStop(temp).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        // 1. 设置设备状态为报停状态
        this.Equipment.Status = EquipmentStatusEnum.failure;
        this.ErrorInfo = resp.data.Data;
        // 2. 对处理另外字段的修改 Remark ? 还有一个目标设备字段  还有一个是对待转移列表数据的获取及展示
      };

      return {
        ErrorInfo: resp.data.Data,
        cb,
      };
    }
    return null;
  }

  /** 设备恢复生产 */
  public async getEquipmentRenew() {
    const resp = await clientApi.getEquipmentRenew(this.Equipment.ID).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        this.Equipment.Status = EquipmentStatusEnum.normal;
        this.getTaskInfo();
      };
      MpMessage.success({ title: '恢复生产成功', onCancel: cb, onOk: cb });
    }
  }

  /** 加工完成 */
  public async setTaskComplete(Number, callback: () => void) {
    if (!this.curTaskData) return;

    const temp = {
      TaskID: this.curTaskData.ID,
      Number,
    };
    const resp = await clientApi.getEquipmentReprot(temp).catch(() => null);

    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.getTaskInfo();
        callback();
      };
      MpMessage.success({ title: '已加工完成', onOk: cb, onCancel: cb });
    }
  }

  /** 任务报错 */
  public async setTaskError(Remark: string, callback: () => void) {
    if (!this.curTaskData) return;

    const temp = {
      ID: this.curTaskData.ID,
      Remark,
    };
    const resp = await clientApi.getEquipmentTaskError(temp).catch(() => null);

    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.getTaskInfo();
        callback();
      };
      MpMessage.success({ title: '设置报错成功', onOk: cb, onCancel: cb });
    }
  }
}
