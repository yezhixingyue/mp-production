import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ILineEquipmentSaveParams } from '../../putOutAndCapacity/js/types';
import { IPlateMakingGroup } from './types';

export class PlateMakingGroupManageItemHandlerClass {
  public itemData: IPlateMakingGroup

  constructor(data: IPlateMakingGroup) {
    this.itemData = data;
  }

  /** 删除设备/工厂 */
  async handleEquipmentRemove(id: string) {
    const resp = await api.getPlateMakingGroupEquipmentRemove(id).catch(() => null);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        this.itemData.Equipments = this.itemData.Equipments.filter(it => it.LineEquipmentID !== id);
      };

      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  }

  /** 添加设备/工厂 */
  async handleEquipmentSubmit(params: ILineEquipmentSaveParams, callback: () => void) {
    const temp = {
      GroupID: this.itemData.ID,
      EquipmentIDS: params.EquipmentIDS,
    };
    const resp = await api.getPlateMakingGroupEquipmentSave(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        if (resp.data) {
          this.itemData.Equipments = resp.data.Data
            .filter(it => !it.IsRemove)
            .map(it => ({ ID: it.EquipmentID, LineEquipmentID: it.LineEquipmentID, Weight: null }));
        }

        callback();
      };
      MpMessage.dialogSuccess({ title: '保存成功', onOk: cb, onCancel: cb });
    }
  }

  handleWeightChange(list: { ID: string, Weight: number }[]) {
    this.itemData.Equipments.forEach(equ => {
      const t = list.find(it => it.ID === equ.LineEquipmentID);
      if (t) {
        const _equ = equ;
        _equ.Weight = t.Weight;
      }
    });
  }
}
