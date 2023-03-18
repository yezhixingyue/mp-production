import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { ProductiveTaskStatusEnum } from '../../enum';

export class Condition {
  /** 设备信息 */
  Catalog: {
    ClassID: number
    GroupID: string
    ID: string
  }

  /** 需要获取到哪些状态的任务 */
  StatusList: ProductiveTaskStatusEnum[] = [ProductiveTaskStatusEnum.Producibility]

  Page = 1

  PageSize = 200

  constructor(Equipment: IManageEquipmentInfo) {
    this.Catalog = {
      ClassID: Equipment.ClassID || -777,
      GroupID: Equipment.GroupID,
      ID: Equipment.ID,
    };

    if (Equipment.AllowBatchReport) { // 如果为批量报工 - 仅调取可生产状态的订单列表
      this.StatusList = [ProductiveTaskStatusEnum.Producibility];
    }
  }
}
