import { MpMessage } from '@/assets/js/utils/MpMessage';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export class Equipment {
  ID = ''

  Name = ''

  ClassID: number | '' = ''

  GroupID = ''

  IsUseable = true

  Index: number | '' = ''

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }

  getSubmitData(): null | Equipment { // 获取新增或编辑保存时需要提交的数据
    if (!this.validate()) return null;
    return this;
  }

  private validate() {
    const { Name, GroupID, Index } = this;

    if (!GroupID) {
      MpMessage.error({ title: '保存失败', msg: '请选择设备组' });
      return false;
    }

    if (!Name) {
      MpMessage.error({ title: '保存失败', msg: '请输入设备名称' });
      return false;
    }

    if (Index === '') {
      MpMessage.error({ title: '保存失败', msg: '请填写显示顺序' });
      return false;
    }

    if (!/^\d+$/.test(Index.toString())) {
      MpMessage.error({ title: '保存失败', msg: '显示顺序格式不正确' });
      return false;
    }

    return true;
  }
}

export type EquipmentListItemType = Omit<Equipment, 'getSubmitData' | 'validate'>
export type EquipmentSubmitDataType = Pick<Required<Equipment>, 'ID'|'Name'|'GroupID'|'Index'>;
