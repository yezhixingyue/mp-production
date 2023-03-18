import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';
import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';

export class Condition {
  /** 设备信息 */
  Catalog: {
    ClassID: number
    GroupID: string
    ID: string
  }

  /** 需要获取到哪些状态的任务 */
  StatusList: ProductiveTaskStatusEnum[] = [
    ProductiveTaskStatusEnum.Producibility,
    ProductiveTaskStatusEnum.InProduction,
    ProductiveTaskStatusEnum.Initial,
    ProductiveTaskStatusEnum.Error,
  ]

  Page = 1

  PageSize = 20

  constructor(Equipment?: IEquipmentBaseInfo) {
    this.Catalog = {
      ClassID: Equipment?.ClassID || -777,
      GroupID: Equipment?.GroupID || '',
      ID: Equipment?.ID || '',
    };
  }
}
