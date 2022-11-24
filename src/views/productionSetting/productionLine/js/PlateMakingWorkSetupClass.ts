import api from '@/api';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import { FetchWorkingProcedureSearchEnum } from '../../js/enums';
import { IPlateMakingAllGroupType, IWorkingProcedureSearch } from '../../PlateMakingGroupView/js/types';
import { ReportModeEnum, ProcessTypeEnum, TemplateTypeEnum } from '../../process/enums';

export class PlateMakingWorkSetupClass {
  /** 当前正在设置的生产线工序 */
  curWorkItem: null | IProductionLineWorkings = null

  /** 当前正在设置的生产线工序名称 */
  WorkName = ''

  /** 全部制版工序列表 */
  PlateMakingWorkAllList: IWorkingProcedureSearch[] = []

  /** 全部制版组列表 */
  PlateMakingGroupAllList: IPlateMakingAllGroupType[] = []

  /**
   * 数据初始化
   *
   * @memberof PlateMakingWorkSetupClass
   */
  init() {
    this.curWorkItem = null;
    this.WorkName = '';
    this.PlateMakingWorkAllList = [];
    this.PlateMakingGroupAllList = [];
    this.getPlateMakingWorkAllList();
    this.getPlateMakingGroupAllList();
  }

  /** 设置当前生产线工序及名称 */
  setCurWorkItem(item: IProductionLineWorkings, WorkName: string) {
    this.curWorkItem = item;
    this.WorkName = WorkName;
  }

  /**
   * 获取全部的制版工序列表
   * 包含印刷版及非印刷版
   *
   * @private
   * @memberof PlateMakingWorkSetupClass
   */
  private async getPlateMakingWorkAllList() {
    const resp = await api.getWorkingProcedureSearch(FetchWorkingProcedureSearchEnum.PlateMaking).catch(() => null);
    if (resp?.data.isSuccess) {
      const temp:IWorkingProcedureSearch = {
        ReportMode: ReportModeEnum.block,
        Type: ProcessTypeEnum.platemaking,
        TemplateType: TemplateTypeEnum.other,
        ID: '',
        Name: '[无]',
        IsSameSizeWithPrintingPlate: null,
      };
      this.PlateMakingWorkAllList = [temp, ...resp.data.Data];
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

  /**
   * 判断该制版工序是否需要设置制版组（ 非印刷版且非印刷版一致可设置且必须设置印刷版 ）
   *
   * @param {string} WorkID  制版工序ID
   * @returns
   * @memberof PlateMakingWorkSetupClass
   */
  getPlateMakingWorkCannotSetGroup(WorkID: string) {
    const PlateMakingWork = this.PlateMakingWorkAllList.find(it => it.ID === WorkID);
    if (!PlateMakingWork || !PlateMakingWork.ID) return false;
    return PlateMakingWork.TemplateType === TemplateTypeEnum.other && !PlateMakingWork.IsSameSizeWithPrintingPlate;
  }
}
