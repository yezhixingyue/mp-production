import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import {
  IAreaList, IExpressList, IShiftRowItem, IShiftTimeItem,
} from './types';

export class ShiftTimeClass implements IShiftTimeItem {
  ItemID = ''

  ItemName = ''

  Shift: IShiftRowItem[] = []

  AreaList: IAreaList[] = []

  AreaDescribe = ''

  ExpressList: IExpressList[] = []

  loaded = false

  async getOriginData(item: IShiftTimeItem | null) {
    if (item) {
      restoreInitDataByOrigin(this, item);
    }
    this.loaded = true;
  }

  private _check() {
    if (!this.ItemName) {
      MpMessage.error({ title: '保存失败', msg: '请设置名称' });
      return false;
    }
    if (this.AreaList.length === 0) {
      MpMessage.error({ title: '保存失败', msg: '请选择区域' });
      return false;
    }

    if (this.ExpressList.length === 0) {
      MpMessage.error({ title: '保存失败', msg: '请选择配送方式' });
      return false;
    }

    if (this.Shift.length === 0) {
      MpMessage.error({ title: '保存失败', msg: '请添加发货班次' });
      return false;
    }

    return true;
  }

  async submit(callback: () => void) {
    if (!this._check()) return;
    const resp = await api.getShiftTimeSave({ ...this }).catch(() => null);
    if (resp?.data?.isSuccess) {
      MpMessage.success({
        title: `${this.ItemID ? '编辑' : '添加'}成功`,
        onOk: callback,
        onCancel: callback,
      });
    }
  }
}
