import api from '@/api';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { ElTable } from 'element-plus';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { LineStatusEnum, LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { _OutsourceConditionLineTypeEnum, Condition } from './Condition';
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

    return { success: !!resp?.data?.isSuccess, data: resp?.data?.Data };
  }

  // 撤回
  const result = await Promise.all(rows.map(row => api.outsourceApis.getExternalFactoryRevocation(row.ID).catch(() => null)));
  const t = result.find(it => !(it?.data?.isSuccess)); // 去找到一个不成功的项目
  return { success: !t };
};

/** 确认外协或撤回成功后对列表数据的修改 */
const handleExternalConfirmSuccess = (rows: Row[], isConfirm: boolean, list?: { TaskID: string; Status: ExternalTaskStatusEnum }[]) => {
  const userStore = useUserStore();

  const _getStatus = (id: string) => {
    if (isConfirm) {
      if (list?.length) {
        const t = list.find(it => it.TaskID === id);
        if (t) return t.Status;
      }

      return ExternalTaskStatusEnum.FactoryReceived;
    }

    return ExternalTaskStatusEnum.WaitFactoryReceive;
  };

  rows.forEach(row => {
    const _row = row;

    // 对列表数据的修改
    _row.Operator = isConfirm ? userStore.user?.StaffName || '' : '';
    _row.Working.ExternalAttribute.Status = _getStatus(_row.ID);
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
  list: Row[] = []

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
      DateTitle: '时间筛选',
      showStatusFilter: false,
    };

    switch (type) {
      case 'await': // 待外协
        options.OnlyStatusList = [
          ExternalTaskStatusEnum.WaitFactoryReceive,
          ExternalTaskStatusEnum.HaveInstored,
          ExternalTaskStatusEnum.FactoryReceived,
          ExternalTaskStatusEnum.Error,
        ];
        options.showStatusFilter = true;
        break;

      case 'inTransition': // 已入库未交接
        options.Status = ExternalTaskStatusEnum.HaveFinished;
        break;

      case 'all': // 全部
        options.showDate = true;
        options.Status = '';
        options.DateTitle = '时间筛选';
        options.showStatusFilter = true;
        break;

      default:
        break;
    }

    this.options = options;

    this.condition = new Condition(this.options);

    // this.init();
  }

  clearCondition() {
    this.condition = new Condition(this.options);
  }

  async getList(Page = 1) { // 获取列表数据
    this.init();
    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();

    const resp = await api.outsourceApis.getExternalTaskList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = getLocalTaskList(resp.data.Data, false, true);
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 确认或撤回多个外协任务 (单个时也要传递数组) */
  public static async handleExternalConfirm(rows: Row[], isConfirm: boolean) {
    if (!rows || rows.length === 0) return false;

    const result = await handleExternalConfirmFetch(rows, isConfirm); // 确认外协或撤回操作

    if (result.success) { // 处理成功
      const cb = () => {
        // 1. 对列表数据的修改
        handleExternalConfirmSuccess(rows, isConfirm, result.data?.List);

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

    if (resp?.data?.isSuccess && resp.data.Message) {
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

  FactoryList: Pick<ISubcontractorFactoryListItemType, 'ID' | 'Name' | 'Mobile'>[] = [{ ID: '', Name: '不限', Mobile: '' }]

  private async _getSubcontractorFactoryList() { // 获取外协工厂列表数据 用于列表筛选
    const resp = await api.getSubcontractorFactoryList({ Page: 1, PageSize: 9999 }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.FactoryList.push(...resp.data.Data);
    }
  }

  /** 生产线筛选数据 */
  LineList: IListItemType[] = []

  private async _getLineList() { // 获取生产线列表数据
    const resp = await api.getProductionLineList({ Type: LineTypeEnum.normal, IsShowWorkingProcedure: true }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.LineList = (resp.data.Data as IProductionLineSet[]).filter(it => it.Status === LineStatusEnum.usable).map(it => ({
        ID: it.ID,
        Name: it.Name,
        children: it.WorkingProcedures,
      }));
    }
  }

  /** 制版组筛选数据 */
  PlateMakingGroupList: IListItemType[] = []

  private async _getPlateMakingGroupList() { // 获取生产线列表数据
    const resp = await api.getWorkingProcedurePlateMakingGroup().catch(() => null);
    if (resp?.data?.isSuccess) {
      this.PlateMakingGroupList = [...(resp.data.Data || [])].map(it => ({
        ID: it.ID,
        Name: it.Name,
        children: it.PlateMakingGroups,
      }));
    }
  }

  get LineAndMakingGroupTreeList() {
    return [
      {
        ID: _OutsourceConditionLineTypeEnum.Line,
        Name: '生产线',
        children: this.LineList,
      },
      {
        ID: _OutsourceConditionLineTypeEnum.MakingGroup,
        Name: '制版组',
        children: this.PlateMakingGroupList,
      },
    ];
  }

  private _inited = false

  public init() {
    if (this._inited) return;
    this._inited = true;
    setTimeout(() => {
      this._getSubcontractorFactoryList();
      this._getLineList();
      this._getPlateMakingGroupList();
    }, 1);
  }

  /** 提交问题 */
  async setQuestion(row: Row, Remark: string, callback: () => void) {
    if (!row || !Remark) return;

    const resp = await api.outsourceApis.getEquipmentTaskError({ ID: row.ID, Remark });

    if (resp.data?.isSuccess) {
      const cb = () => {
        callback();
      };

      const t = this.list.find(it => it.ID === row.ID);
      if (t) {
        const userStore = useUserStore();
        t.Operator = userStore.user?.StaffName || '';
        t.Working.ExternalAttribute.Status = ExternalTaskStatusEnum.Error;
        t._ExternalStatusText = getEnumNameByID(t.Working.ExternalAttribute.Status, ExternalTaskStatusEnumList); // 更新展示项目 - 状态
      }

      MpMessage.dialogSuccess('问题已提交', cb, cb);
    }
  }
}
