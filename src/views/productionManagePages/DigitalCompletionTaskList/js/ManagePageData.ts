import { EquipmentFilterClass } from '@/assets/js/Class/EquipmentFilterClass';
import { IUser } from '@/store/modules/user/types';
import api from '@/api';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { ManageDigitalCompletionTaskList } from './ManageDigitalCompletionTaskList';

export class ManagePageData {
  Permission: IUser['PermissionList']['PermissionManageDigitalTask']

  TabList: { ID: boolean; Name:string }[] = []

  private _currentTab: '' | boolean = '';

  get currentTab() {
    return this._currentTab;
  }

  set currentTab(val: typeof this._currentTab) {
    if (typeof val !== 'boolean') return;

    const t = this.dataList.find(it => it.IsPlateTask === val);

    if (!t) {
      this.dataList.push(new ManageDigitalCompletionTaskList(val));
    }

    this._currentTab = val;
  }

  /** 两种不同报工方式工序的列表数据 */
  private dataList: ManageDigitalCompletionTaskList[] = [] // 版工序 和 订单工序

  get currentTaskList() {
    return this.dataList.find(it => it.IsPlateTask === this.currentTab);
  }

  constructor(Permission: IUser['PermissionList']['PermissionManageDigitalTask']) {
    this.Permission = Permission;

    if (Permission.Obj.PlateQuery) this.TabList.push({ ID: true, Name: '版工序' });
    if (Permission.Obj.OrderQuery) this.TabList.push({ ID: false, Name: '订单工序' });
  }

  init() {
    if (this.TabList.length > 0) {
      this.currentTab = this.TabList[0].ID;

      this.EquipmentFilterData.getInitData();
      this.getLineList();
    }
  }

  /** 用于向头部设备筛选提供数据支持 */
  EquipmentFilterData: Required<EquipmentFilterClass> = new EquipmentFilterClass(3)

  /** 生产线筛选数据 */
  LineList: IListItemType[] = []

  async getLineList() { // 获取生产线列表数据
    const resp = await api.getProductionLineList({ Type: LineTypeEnum.normal, IsDigital: true, IsShowWorkingProcedure: true }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.LineList = [...(resp.data.Data as IProductionLineSet[]).filter(it => it.IsDigital)];
    }
  }
}
