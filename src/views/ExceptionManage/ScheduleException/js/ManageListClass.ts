import api from '@/api';
import { ElTable } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { useUserStore } from '@/store/modules/user';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { Condition } from './Condition';
import { ISchedulingExceptionListItem } from './type';
import { SchedulingExceptionTypeEnumList } from './EnumList';

export class ManageListClass {
  /** 条件 */
  condition = new Condition()

  list: (ISchedulingExceptionListItem & { _Type: string, _CreateTime: string, _HaveDeal: string, _DealContent: string })[] = []

  listNumber = 0

  loading = false

  /** 多选选中的列表 */
  selectList: typeof this.list = []

  setSelectList(rows: typeof this.list) {
    this.selectList = rows;
  }

  multipleTableRef: InstanceType<typeof ElTable> | null = null

  setMultipleTableRef(multipleTableRef: InstanceType<typeof ElTable> | null) {
    this.multipleTableRef = multipleTableRef;
  }

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

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data.map(it => ({
        ...it,
        _Type: getEnumNameByID(it.Type, SchedulingExceptionTypeEnumList),
        _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
        _HaveDeal: it.DealTime ? '已处理' : '未处理',
        _DealContent: `${format2MiddleLangTypeDateFunc2(it.DealTime)}${it.Operator ? ` （${it.Operator?.Name}）` : ''}`,
      }));
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 标记传入列表为已处理状态 */
  async setRowsHaveDeal(rows: typeof this.list) {
    const ids = rows.map(r => r.ID);
    const resp = await api.ExceptionHandlerApis.getSchedulingExceptionDeal(ids).catch(() => null);

    if (resp?.data?.isSuccess) {
      const cb = () => {
        const userStore = useUserStore();
        const { user } = userStore;
        const curTime = getTimeConvertFormat({ withHMS: true });

        rows.forEach(row => {
          const _row = row;
          _row.DealTime = curTime;
          if (user) _row.Operator = { ID: user.StaffID, Name: user.StaffName };

          _row._HaveDeal = '已处理';
          _row._DealContent = `${format2MiddleLangTypeDateFunc2(_row.DealTime)}${_row.Operator ? ` （${_row.Operator?.Name}）` : ''}`;

          if (this.multipleTableRef && this.selectList.includes(row)) this.multipleTableRef.toggleRowSelection(row, false);
        });
      };

      MpMessage.success('设置成功', cb, cb);
    }
  }
}
