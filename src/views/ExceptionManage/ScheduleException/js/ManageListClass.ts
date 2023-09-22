import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { useUserStore } from '@/store/modules/user';
import { Condition } from './Condition';
import { ISchedulingExceptionListItem } from './type';

export class ManageListClass {
  /** 条件 */
  condition = new Condition()

  list: ISchedulingExceptionListItem[] = []

  listNumber = 0

  loading = false

  /** 清空条件筛选项 */
  clearCondition() {
    this.condition = new Condition();
  }

  /** 获取列表数据 */
  async getList(Page = 1) {
    if (!this.condition) return;

    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();
    const resp = await api.ExceptionHandlerApis.getSchedulingExceptionList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  async setHaveDeal(row: ISchedulingExceptionListItem) {
    const resp = await api.ExceptionHandlerApis.getSchedulingExceptionDeal(row.ID).catch(() => null);
    if (resp?.data.isSuccess) {
      const cb = () => {
        const t = this.list.find(it => it.ID === row.ID);
        if (!t) return;

        const _row = t;
        _row.DealTime = getTimeConvertFormat({ withHMS: true });

        const userStore = useUserStore();
        if (userStore.$state.user) _row.Operator = { ID: userStore.$state.user.StaffID, Name: userStore.$state.user.StaffName };
      };
      MpMessage.success('设置成功', cb, cb);
    }
  }
}
