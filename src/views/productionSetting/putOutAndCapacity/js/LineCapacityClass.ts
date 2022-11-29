import api from '@/api';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { CapacityTypeEnum } from '../capacity/enum';
import { CapacityConditionItemClass } from './CapacityConditionItemClass';
import { PutOutCapacityCommonListClass } from './PutOutCapacityCommonListClass';

export class LineCapacityClass extends PutOutCapacityCommonListClass<CapacityConditionItemClass> {
  getListFunc = api.getProductionLineCapacityList;

  removeFunc = api.getProductionLineCapacityRemove;

  saveFunc = api.getProductionLineCapacitySave

  getPropertyListParams = {
    UseModule: UseModuleEnum.CapacityLimit,
    EquipmentGroupID: this.curLineEquipment?.GroupID || '',
  }

  curCapacityType = CapacityTypeEnum.preparation

  setCurCapacityType(type: CapacityTypeEnum) {
    this.curCapacityType = type;
  }

  /** 设置计算数量的属性列表 */
  rightPropertyList: PropertyListItemType[] = []

  async getRightPropertyList() {
    const temp = {
      UseModule: UseModuleEnum.CapacityNumber,
      EquipmentGroupID: this.curLineEquipment?.GroupID || '',
      WorkingID: this.curWork?.ID || '',
    };

    const resp = await api.propertyApis.getPropertyList(temp).catch(() => null);
    if (resp?.data.isSuccess) {
      this.rightPropertyList = resp.data.Data || [];
    }
  }
}
