import api from '@/api';
import { IUser } from '@/store/modules/user/types';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { ElMessage } from 'element-plus';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { IAdjustInfo } from '../../types';
import { AdjustTabTypeEnum } from '../../types/enum';
import { AdjustCondition } from './AdjustCondition';
import { localPrepressAdjModel } from '../../store';

/** 提前入尾版管理类 - 和追加印数共用 */
export class AdjustListManageModel {
  _Type: AdjustTabTypeEnum

  condition = new AdjustCondition()

  list: IAdjustInfo[] = []

  listNumber = 0

  loading = false

  LineList: IBaseProperty<string>[] = []

  constructor(Type: AdjustTabTypeEnum, user: IUser) {
    this._Type = Type;

    this.updateLineList(user.AdjustPermissions);
  }

  updateLineList(AdjustPermissions: IBaseProperty<string>[] | null) {
    this.LineList = [
      { ID: '', Name: '所有生产线' },
    ];

    if (AdjustPermissions) {
      this.LineList.push(...AdjustPermissions);
    }

    const ids = this.LineList.map(it => it.ID);
    if (!ids.includes(this.condition.LineID)) {
      this.condition.LineID = '';
    }
  }

  clearCondition() {
    this.condition = new AdjustCondition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;

    this.list = [];

    if (this.LineList.filter(it => it.ID !== '').length <= 0) { // 无可用生产线权限
      this.listNumber = 0;
      return;
    }

    this.loading = true;

    const temp = this.condition.filter();

    const _requester = this._Type === AdjustTabTypeEnum.UnionPlate
      ? api.productionManageApis.getOrderChunkUnionPlateList
      : api.productionManageApis.getOrderChunkNumberList;

    const resp = await _requester(temp);

    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 提前转入 */
  async submitAdvEnter(Remark: string, item: IAdjustInfo, callback: () => void) {
    const temp = {
      Remark,
      ChunkID: item.ID,
      PlateID: item.PlateID,
    };
    const resp = await api.productionManageApis.getOrderChunkUnionPlateAdd(temp);
    if (resp.data?.isSuccess) {
      ElMessage({ showClose: true, message: '转入成功', type: 'success' });
      const t = this.list.find(it => it.ID === item.ID);
      if (t) {
        t.Remark = Remark;
        t.CreateTime = getTimeConvertFormat({ withHMS: true });
        t.OperatorID = localPrepressAdjModel.value.user?.StaffID || '';
        t.OperatorName = localPrepressAdjModel.value.user?.StaffName || '';
        t.PlateID = resp.data.Data;
        t.CurrentNumber = t.RemainNumber;
      }
      callback();
    }
  }

  /** 撤销提前转入 */
  async cancelAdv(item: IAdjustInfo) {
    const resp = await api.productionManageApis.getOrderChunkUnionPlateRemove(item.ID);
    if (resp.data?.isSuccess) {
      ElMessage({ showClose: true, message: '已撤回', type: 'success' });
      const t = this.list.find(it => it.ID === item.ID);
      if (t) {
        t.Remark = '';
        t.CreateTime = '';
        t.OperatorID = '';
        t.OperatorName = '';
        t.CurrentNumber = null;
        t.PlateID = resp.data.Data;
      }
    }
  }

  /** 追加印数 */
  async addNumber(e: object, callback: () => void) {
    const resp = await api.productionManageApis.getOrderChunkNumberAdd(e);
    if (resp.data?.isSuccess) {
      this.clearCondition();
      this.getList();
      ElMessage({ showClose: true, message: '追加成功', type: 'success' });
      callback();
    }
  }

  /** 删除追加印数条目 */
  async removeAdd(item: IAdjustInfo) {
    const resp = await api.productionManageApis.getOrderChunkNumberRemove(item.ID);
    if (resp.data?.isSuccess) {
      ElMessage({ showClose: true, message: '已删除', type: 'success' });
      this.list = this.list.filter(it => it.ID !== item.ID);
      this.listNumber -= 1;
    }
  }
}
