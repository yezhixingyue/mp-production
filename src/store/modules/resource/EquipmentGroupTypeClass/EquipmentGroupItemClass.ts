import { MpMessage } from '@/assets/js/utils/MpMessage';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export class EquipmentGroupItemClass {
  GroupID = ''

  Name = ''

  ClassID: number|'' = ''

  FactoryIDS: string[] = []

  ColorLimitContent = ''

  MinWidth: number|'' = ''

  MaxWidth: number|'' = ''

  MinLength: number|'' = ''

  MaxLength: number|'' = ''

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }

  validate() {
    if (typeof this.ClassID !== 'number') {
      MpMessage.error({ title: '保存失败', msg: '请选择分类' });
      return false;
    }
    if (!this.Name) {
      MpMessage.error({ title: '保存失败', msg: '请输入设备组名称' });
      return false;
    }
    return true;
  }
}

export type EquipmentGroupItemType = Omit<EquipmentGroupItemClass, 'validate'>;
