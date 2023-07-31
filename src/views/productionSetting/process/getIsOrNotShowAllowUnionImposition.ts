import { IWorkingProcedureSearch } from '../PlateMakingGroupView/js/types';
import { ReportModeEnum, WorkingTypeEnum } from './enums';

/** 获取当前的工序是否需要展示或是否可设置允许合拼 */
export const getIsOrNotShowAllowUnionImposition = (item: Pick<IWorkingProcedureSearch, 'Type' | 'ReportMode' | 'AllowUnionImposition'>) => {
  const { ReportMode, Type } = item;
  return ReportMode === ReportModeEnum.board && [WorkingTypeEnum.normal, WorkingTypeEnum.split].includes(Type);
};
