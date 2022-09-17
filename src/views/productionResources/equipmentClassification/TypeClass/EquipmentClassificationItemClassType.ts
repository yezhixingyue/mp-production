import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { EquipmentClassificationListItem } from '../types';

export class EquipmentClassificationItemClassType { // EquipmentClassificationItem
  ID = '';

  Name = '';

  constructor(data: EquipmentClassificationListItem | null) {
    if (data) restoreInitDataByOrigin(this, data);
  }

  validate(list: EquipmentClassificationListItem[]) { // 校验
    const { Name, ID } = this;
    if (!Name) {
      MpMessage.error({ title: '保存失败', msg: '请输入名称' });
      return false;
    }

    const t = list.find(it => it.ID !== ID && it.Name === Name);
    if (t) {
      MpMessage.error({ title: '保存失败', msg: '存在名称重复' });
      return false;
    }

    return true;
  }

  async submit(cb: (temp: EquipmentClassificationListItem) => void) {
    const temp = CommonClassType.filter({ ...this });
    const resp = await api.getEquipmentClassificationSave(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      const title = this.ID ? '编辑成功' : '添加成功';
      const callback = () => {
        const temp: EquipmentClassificationListItem = {
          ID: +resp.data.Data,
          Name: this.Name,
        };
        cb(temp);
      };
      MpMessage.success({ title, onOk: callback, onCancel: callback });
    }
  }
}
