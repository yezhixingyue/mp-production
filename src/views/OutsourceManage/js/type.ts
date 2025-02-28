import { IWorkingProcedureInfo } from '@/assets/Types/ProductionLineSet/types';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { ExternalTaskStatusEnum } from './enum';

/**
 * 外协管理页面类型：待外协 | 已入库未交接 | 全部  'await' | 'inTransition' | 'all'
 *
 * @export
 * @interface IOutsourceManagePageType
 */
export type OutsourceManagePageType = 'await' | 'inTransition' | 'all' | 'undelivered'

/**
 * 根据上面页面类型确定的页面差异对象，用于生成页面类型相对应的数据选项
 *
 * @export
 * @interface ISwitchOptions
 */
export interface ISwitchOptions {
  showDate: boolean
  Status: ExternalTaskStatusEnum | ''
  DateType: string
  DateTitle: string
  showStatusFilter: boolean
  OnlyStatusList?: ExternalTaskStatusEnum[]
}

/** 指定带有制版组的工序信息接口类型 */
export interface IPlateMakingGroupWorkingProcedure extends Pick<IWorkingProcedureInfo, 'ID' | 'Name'> {
  PlateMakingGroups: IBaseProperty<string>[]
}
