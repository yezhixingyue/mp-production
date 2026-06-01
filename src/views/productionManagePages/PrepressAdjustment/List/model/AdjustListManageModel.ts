import api from '@/api';
import { IUser } from '@/store/modules/user/types';
import { ElMessage } from 'element-plus';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { IAdjustInfo } from '../../types';
import { AdjustTabTypeEnum } from '../../types/enum';
import { AdjustCondition } from './AdjustCondition';

/** 提前入尾版管理类 - 和追加印数共用 */
export class AdjustListManageModel {
  _Type: AdjustTabTypeEnum

  condition = new AdjustCondition()

  list: IAdjustInfo[] = []

  listNumber = 0

  loading = false

  /** 当前登录账户可用生产线 */
  // myLineList: IBaseProperty<string>[] = []

  /** 所有操作人可用生产线并集id列表 -- 用于顶部筛选 */
  // lineIdUnionSet: string[] = []

  user: IUser

  constructor(Type: AdjustTabTypeEnum, user: IUser) {
    this._Type = Type;

    this.user = user;
  }

  clearCondition() {
    this.condition = new AdjustCondition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;

    this.list = [];

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
        t.OperatorID = this.user.StaffID;
        t.OperatorName = this.user.StaffName;
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
