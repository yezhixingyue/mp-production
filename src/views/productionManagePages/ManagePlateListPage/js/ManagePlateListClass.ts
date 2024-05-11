import api from '@/api';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { IPlateMakingAllGroupType, IWorkingProcedureSearch } from '@/views/productionSetting/PlateMakingGroupView/js/types';
import { FetchWorkingProcedureSearchEnum } from '@/views/productionSetting/js/enums';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { ProductLineSimpleType } from '../../ManualOrderHandlerPage/js/types';
import { Condition } from './Condition';
import { IManagePlateInfo } from './type';
import { PlateTypeEnum } from './enum';

/** 大版列表 和 后工版列表共用类 */
export class ManagePlateListClass {
  /** 获取订单列表的条件信息 */
  condition: Condition

  /** 订单列表数据 */
  list: IManagePlateInfo[] = []

  /** 订单列表条目数 */
  listNumber = 0

  /** 是否正在加载中 */
  loading = false

  constructor(type: PlateTypeEnum) {
    this.condition = new Condition(type);
  }

  /** 设置条件 */
  setCondition(e: ISetConditionParams) {
    CommonClassType.setCondition(e, this.condition);
  }

  clearCondition() {
    this.condition = new Condition(this.condition.Type);
  }

  /** 生产线 暂定不包含组合生产线 */
  ProductionLineList: ProductLineSimpleType[] = []

  private async getProductionLineList() {
    if (this.ProductionLineList.length > 0) return;
    const resp = await api.getProductionLineAll().catch(() => null);
    if (resp?.data.isSuccess) {
      const list = (resp.data.Data as ProductLineSimpleType[]).filter(it => it.Type === LineTypeEnum.normal);
      this.ProductionLineList = [{ ID: '', Name: '所有生产线', Type: LineTypeEnum.normal, IsDigital: false }, ...list];
    }
  }

  /** 获取列表数据 */
  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    CommonClassType.setDate(this.condition, 'CreateTime');
    const temp = CommonClassType.filter(this.condition, true);

    this.loading = true;
    const resp = await api.productionManageApis.getPlateList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 制版组工序列表（非印刷版及非印刷版相同） */
  private WorkingList: IWorkingProcedureSearch[] = []

  /** 全部制版组列表 */
  private PlateMakingGroupAllList: IPlateMakingAllGroupType[] = []

  WorkingAndMakingGroupList: IListItemType[] = []

  private async getWorkingList() {
    const resp = await api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.PlateMakingGroup).catch(() => null);
    if (resp?.data.isSuccess) {
      this.WorkingList = resp.data.Data;
    }
  }

  /**
   * 获取所有制版组列表
   * 后面根据对应制版工序ID 筛选出需要的列表
   *
   * @private
   * @memberof PlateMakingWorkSetupClass
   */
  private async getPlateMakingGroupAllList() {
    const resp = await api.getPlateMakingGroupAll().catch(() => null);
    if (resp?.data.isSuccess) {
      this.PlateMakingGroupAllList = resp.data.Data;
    }
  }

  async getInitData() {
    this.getList();

    if (this.condition.Type === PlateTypeEnum.Plate) { // 大版
      this.getProductionLineList();
    } else if (this.condition.Type === PlateTypeEnum.LaterCraft) { // 后工版
      await Promise.all([this.getWorkingList(), this.getPlateMakingGroupAllList()]);
      const list = this.WorkingList.map(it => ({
        ID: it.ID,
        Name: it.Name,
        children: this.PlateMakingGroupAllList.filter(g => g.WorkID === it.ID),
      })).filter(it => it.children.length > 0);

      this.WorkingAndMakingGroupList = list;
    }
  }
}
