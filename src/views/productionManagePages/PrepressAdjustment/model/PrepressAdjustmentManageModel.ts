import api from '@/api';
import { LineTypeEnum, NormalLineCategoryTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';
import { IUser } from '@/store/modules/user/types';
import { AdjustTabTypeEnum } from '../types/enum';
import { AdjustListManageModel } from '../List/model/AdjustListManageModel';

/** 印前调整模块管理类 */
export class PrepressAdjustmentManageModel {
  /** 当前登录用户 */
  user: IUser | null = null;

  /** 印前调整权限 */
  get Permission() {
    return this.user?.PermissionList.PermissionPrePrintAdjust || null;
  }

  /** 页面顶部Tab列表数据 */
  TabList: { ID: AdjustTabTypeEnum; Name:string }[] = []

  /** 当前选中Tab */
  currentTab: '' | AdjustTabTypeEnum = '';

  /** 数据初始化 */
  init(user: IUser) {
    this.user = user;

    if (this.Permission) {
      if (this.Permission.Obj.UnionPlateQuery) this.TabList.push({ ID: AdjustTabTypeEnum.UnionPlate, Name: '提前入尾版' });
      if (this.Permission.Obj.AddNumberQuery) this.TabList.push({ ID: AdjustTabTypeEnum.AddNumber, Name: '追加印数' });
    }

    // this._getProductionLineList();

    if (this.TabList.length > 0) {
      this.onTabChange(this.TabList[0].ID);
    }
  }

  /** 提前入尾版模块数据 */
  unionPlateModuleData: null | AdjustListManageModel = null

  /** 追加印数模块数据 */
  addNumberModuleData: null | AdjustListManageModel = null

  onTabChange(val: AdjustTabTypeEnum) {
    this.currentTab = val;

    const { user } = this;
    if (!user) return;

    switch (val) {
      case AdjustTabTypeEnum.UnionPlate:
        if (this.unionPlateModuleData === null) {
          this.unionPlateModuleData = new AdjustListManageModel(AdjustTabTypeEnum.UnionPlate, user);
        }
        setTimeout(() => {
          this.unionPlateModuleData!.getList();
        }, 10);
        break;

      case AdjustTabTypeEnum.AddNumber:
        if (this.addNumberModuleData === null) {
          this.addNumberModuleData = new AdjustListManageModel(AdjustTabTypeEnum.AddNumber, user);
        }
        setTimeout(() => {
          this.addNumberModuleData!.getList();
        }, 10);
        break;

      default:
        break;
    }
  }

  /** 生产线筛选数据 */
  ProductionLineList: IProductionLineSet[] = []

  async getProductionLineList() { // 获取生产线列表数据
    const resp = await api.getProductionLineList({ Type: LineTypeEnum.normal });
    if (resp?.data?.isSuccess) {
      this.ProductionLineList = (resp.data.Data as IProductionLineSet[]).filter(it => it.Category !== NormalLineCategoryTypeEnum.digital);
    }
  }
}
