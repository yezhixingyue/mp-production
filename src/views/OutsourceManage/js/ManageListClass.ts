import api from '@/api';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { ElTable } from 'element-plus';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { Condition } from './Condition';
import { ExternalTaskStatusEnum } from './enum';
import { ExternalTaskStatusEnumList } from './EnumList';
import { ISwitchOptions, OutsourceManagePageType } from './type';

type Row = ReturnType<typeof getLocalTaskList>[number];

/** 处理单个外协任务的确认外协或撤回操作 */
const handleExternalConfirmFetch = async (rows: Row[], isConfirm: boolean) => {
  if (isConfirm) { // 确认外协
    const List = rows.map(r => ({
      ...r._ExternalSubmitParams,
      Amount: +r._ExternalSubmitParams.Amount,
    }));

    const resp = await api.outsourceApis.getExternalFactoryTakeOrder({ List }).catch(() => null);

    return !!resp?.data.isSuccess;
  }

  // 撤回
  const result = await Promise.all(rows.map(row => api.outsourceApis.getExternalFactoryRevocation(row.ID).catch(() => null)));
  const t = result.find(it => !(it?.data.isSuccess)); // 去找到一个不成功的项目
  return !t;
};

/** 确认外协或撤回成功后对列表数据的修改 */
const handleExternalConfirmSuccess = (rows: Row[], isConfirm: boolean) => {
  const userStore = useUserStore();
  rows.forEach(row => {
    const _row = row;

    // 对列表数据的修改
    _row.Operator = isConfirm ? userStore.user?.StaffName || '' : '';
    _row.Working.ExternalAttribute.Status = isConfirm ? ExternalTaskStatusEnum.FactoryReceived : ExternalTaskStatusEnum.WaitFactoryReceive;
    _row.StartTime = isConfirm ? getTimeConvertFormat({ withHMS: true }) : '';
    _row._ExternalStatusText = getEnumNameByID(_row.Working.ExternalAttribute.Status, ExternalTaskStatusEnumList); // 更新展示项目 - 状态
    _row._StartTime = isConfirm ? format2MiddleLangTypeDateFunc2(_row.StartTime) : ''; // 更新展示项目 - 外协时间
    _row._ExternalStatusCtrlText = isConfirm ? '撤回' : '确认外协';
    _row._ExternalSubmitParams._FactoryName = _row.Working.UseableEquipmentList?.find(it => it.ID === _row._ExternalSubmitParams.FactoryID)?.Name || '';
  });
};

export class ManageListClass {
  /** 类型: 待外协 | 已入库未交接 | 全部 */
  options: ISwitchOptions

  /** 条件 */
  condition: Condition

  /** 列表数据 */
  list: ReturnType<typeof getLocalTaskList> = []

  listNumber = 0

  loading = false

  /** 选中的列表项数组 */
  multipleSelection: Row[] = []

  private _oTableRef: InstanceType<typeof ElTable> | null = null

  setMultipleSelection(list: ManageListClass['multipleSelection'], oTableRef: InstanceType<typeof ElTable>) {
    this.multipleSelection = list || [];
    this._oTableRef = oTableRef;
  }

  constructor(type: OutsourceManagePageType) { // 初始化
    const options: ISwitchOptions = {
      showDate: false,
      Status: ExternalTaskStatusEnum.WaitFactoryReceive,
      DateType: '',
      DateTitle: '时间筛选',
    };

    switch (type) {
      case 'await': // 待外协

        break;

      case 'inTransition': // 已入库未交接
        options.Status = ExternalTaskStatusEnum.HaveFinished;
        break;

      case 'all': // 全部
        options.showDate = true;
        options.Status = '';
        options.DateType = 'CreateTime';
        options.DateTitle = '创建时间';
        break;

      default:
        break;
    }
    console.log('options', options);
    this.options = options;

    this.condition = new Condition(this.options);

    this._getSubcontractorFactoryList();
  }

  clearCondition() {
    this.condition = new Condition(this.options);
  }

  async getList(Page = 1) { // 获取列表数据
    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();

    const resp = await api.outsourceApis.getExternalTaskList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = getLocalTaskList(resp.data.Data, false, true);
      this.listNumber = resp.data.DataNumber;
    }
  }

  FactoryList: Pick<ISubcontractorFactoryListItemType, 'ID' | 'Name'>[] = [{ ID: '', Name: '不限' }]

  private async _getSubcontractorFactoryList() { // 获取外协工厂列表数据 用于列表筛选
    const resp = await api.getSubcontractorFactoryList({ Page: 1, PageSize: 9999 }).catch(() => null);

    if (resp?.data.isSuccess) {
      this.FactoryList.push(...resp.data.Data);
    }
  }

  /** 确认或撤回多个外协任务 (单个时也要传递数组) */
  public static async handleExternalConfirm(rows: Row[], isConfirm: boolean) {
    if (!rows || rows.length === 0) return false;

    const result = await handleExternalConfirmFetch(rows, isConfirm); // 确认外协或撤回操作

    if (result) { // 处理成功
      const cb = () => {
        // 1. 对列表数据的修改
        handleExternalConfirmSuccess(rows, isConfirm);

        // 2. 从multipleSelection列表中删除掉该项 及 从table的全部选中项中移除掉操作项 --- 暂不移除
        // if (isConfirm) {
        //   const ids = rows.map(r => r.ID);
        //   this.multipleSelection = this.multipleSelection.filter(it => !ids.includes(it.ID));
        //   if (this._oTableRef) {
        //     rows.forEach((row) => {
        //       if (this._oTableRef) {
        //         this._oTableRef.toggleRowSelection(row, false);
        //       }
        //     });
        //   }
        // }
      };
      if (!isConfirm) {
        MpMessage.success(isConfirm ? '外协成功' : '撤回成功', cb, cb);
      } else {
        MpMessage.dialogSuccess(isConfirm ? '外协成功' : '撤回成功', cb, cb);
        // ElNotification({
        //   title: '外协成功，已自动打印工单',
        //   duration: 2000,
        // });
        // cb();
      }

      return true;
    }

    return false;
  }

  /**
   * 外协工单文件下载
   *
   * @static
   * @param {Row[]} rows
   * @memberof ManageListClass
   */
  public static async downloadExTaskFiles(rows: Row[]) {
    if (!rows || rows.length === 0) return;

    const List = rows.map(it => ({ TaskID: it.ID }));
    const resp = await api.outsourceApis.getExternalFactoryDownload({ List }).catch(() => null);

    if (resp?.data.isSuccess && resp.data.Message) {
      const url = resp.data.Message;

      const link = document.createElement('a');

      link.style.display = 'none';
      link.href = url;

      // link.setAttribute('download', `${fileName}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      link.onload = () => {
        window.URL.revokeObjectURL(url);
      };
    }
  }
}
