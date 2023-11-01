import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { ProductiveTaskStatusEnum } from '../../enum';

export class Condition {
  /** 设备信息 */
  Catalog?: {
    ClassID: number
    GroupID: string
    ID: string
  }

  /** 需要获取到哪些状态的任务 */
  StatusList: ProductiveTaskStatusEnum[] = [ProductiveTaskStatusEnum.Producibility]

  /** 是否为获取未送出任务列表 */
  _UnReceived = false

  /** 当前设备id --- 仅获取未送出任务列表时使用 */
  SendEquipment?: string

  Page = 1

  PageSize = 50

  constructor(Equipment: IManageEquipmentInfo, isUndelevered: boolean) {
    this.setEquipment(Equipment);

    if (Equipment.AllowBatchReport) { // 如果为批量报工 - 仅调取可生产状态的订单列表
      this.StatusList = [ProductiveTaskStatusEnum.Producibility];
    }

    if (isUndelevered) {
      this.StatusList = [];
      this._UnReceived = true;
      this.PageSize = 20;
      this.SendEquipment = Equipment.ID;
    } else {
      this.Catalog = {
        ClassID: Equipment.ClassID || -777,
        GroupID: Equipment.GroupID,
        ID: Equipment.ID,
      };
    }
  }

  setEquipment(Equipment: IManageEquipmentInfo) {
    if (this._UnReceived) {
      this.SendEquipment = Equipment.ID;
    } else {
      this.Catalog = {
        ClassID: Equipment.ClassID || -777,
        GroupID: Equipment.GroupID,
        ID: Equipment.ID,
      };
    }
  }

  getParams(StartProduction = false) {
    if (this._UnReceived) {
      return {
        Page: this.Page,
        PageSize: this.PageSize,
        SendEquipment: this.SendEquipment,
        StartProduction,
      };
    }

    return {
      Page: this.Page,
      PageSize: this.PageSize,
      Catalog: this.Catalog,
      StatusList: this.StatusList,
      StartProduction,
    };
  }
}
