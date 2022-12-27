import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import { FetchWorkingProcedureSearchEnum } from '../../js/enums';
import { IPlateMakingAllGroupType, IWorkingProcedureSearch } from '../../PlateMakingGroupView/js/types';
import { ReportModeEnum, WorkingTypeEnum } from '../../process/enums';
import { ISetPlateMakingWorkParams, ILocalProductionLineWorkings } from './types';

export class PlateMakingWorkSetupClass {
  /** 当前正在设置的生产线工序 */
  curWorkItem: null | ILocalProductionLineWorkings = null

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
    this.PlateMakingWorkAllList = [];
    this.PlateMakingGroupAllList = [];
    this.getPlateMakingWorkAllList();
    this.getPlateMakingGroupAllList();
  }

  /** 设置当前生产线工序及名称 */
  setCurWorkItem(item: ILocalProductionLineWorkings) {
    this.curWorkItem = item;
  }

  /**
   * 保存制版工序
   *
   * @param {ISetPlateMakingWorkParams} ruleForm
   * @param {() => void} callback
   * @memberof PlateMakingWorkSetupClass
   */
  async handlePlateMakingWorkSubmit(ruleForm: ISetPlateMakingWorkParams, callback: () => void) {
    const resp = await api.getProductionLineWorkingProcedureSetPlateMakingWork(ruleForm).catch(() => null);
    if (resp?.data.isSuccess) {
      const cb = () => {
        if (this.curWorkItem) {
          this.curWorkItem.PlateMakingWorkID = ruleForm.PlateMakingWorkID;
          this.curWorkItem.PlateMakingGroupID = ruleForm.PlateMakingGroupID || null;
          if (resp.data.Data.PlateMakingWorkIdentID !== this.curWorkItem.PlateMakingWorkIdentID) {
            // 当该ID未变化时 不予重新赋值
            this.curWorkItem.PlateMakingWorkIdentID = resp.data.Data.PlateMakingWorkIdentID;
            this.curWorkItem.PlateMakingClassEquipmentGroups = resp.data.Data.PlateMakingClassEquipmentGroups;
            this.curWorkItem.PlateMakingMaterialSources = resp.data.Data.PlateMakingMaterialSources;
          }
        }
        callback();
      };
      MpMessage.success({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
    }
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
        Type: WorkingTypeEnum.platemaking,
        // TemplateType: TemplateTypeEnum.other,
        IsPrintingPlate: null,
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
    return !PlateMakingWork.IsPrintingPlate && !PlateMakingWork.IsSameSizeWithPrintingPlate;
  }

  /**
   * 获取生产线列表中制版工序展示文字
   *
   * @param {IProductionLineWorkings} item
   * @returns
   * @memberof PlateMakingWorkSetupClass
   */
  getPlateMakingWorkContent(item: IProductionLineWorkings) {
    if (!item.PlateMakingWorkID) return '';
    const t = this.PlateMakingWorkAllList.find(it => it.ID === item.PlateMakingWorkID);
    if (!t) return '';
    if (!item.PlateMakingGroupID) return t.Name;
    const g = this.PlateMakingGroupAllList.find(it => it.ID === item.PlateMakingGroupID);
    if (!g) return t.Name;
    return `${t.Name} ( ${g.Name} )`;
  }
}
