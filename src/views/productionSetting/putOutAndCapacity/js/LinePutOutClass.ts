import api from '@/api';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PutOutCapacityCommonListClass } from './PutOutCapacityCommonListClass';
import { PutOutConditionItemClass } from './PutOutConditionItemClass';

export class LinePutOutClass extends PutOutCapacityCommonListClass<PutOutConditionItemClass> {
  getListFunc = api.getProductionLinePutOutList;

  removeFunc = api.getProductionLinePutOutRemove;

  saveFunc = api.getProductionLinePutOutSave

  getPropertyListParams = {
    UseModule: UseModuleEnum.PutOutLimit,
    EquipmentGroupID: this.curLineEquipment?.GroupID || '',
  }
}
