import { TargetTypeEnum } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/enum';
import { INextWorkingProduction, ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';

/** 获取报工工序中的一些文字展示信息 */
export const getTaskDisplayInfo = (TaskData: ITaskDetail, withTemplate = true) => {
  const WorkingList:IBaseProperty<string>[] = [];

  const temp = {
    Unit: '',
    FirstTitle: '',
    SecondTitle: '',
    WorkingList,
  };

  // 1. 处理订单和块共用部分
  temp.FirstTitle = [
    TaskData.Working.OrderInfo?.FirstLevel,
    TaskData.Working.OrderInfo?.SecondLevel,
    TaskData.Working.OrderInfo?.ProductName,
  ].filter(it => it).join('-') || '';

  switch (TaskData.Working.ReportMode) {
    case ReportModeEnum.board:
      temp.Unit = TaskData.Working.PlateInfo?.Unit || '';
      temp.FirstTitle = TaskData.Working.PlateInfo?.Material || '';
      temp.SecondTitle = `${withTemplate && TaskData.Working.PlateInfo?.Template ? `${TaskData.Working.PlateInfo?.Template} ` : ''}
        ${TaskData.Working.PlateInfo?.TemplateSize || ''}`;
      temp.WorkingList = TaskData.Working.PlateInfo?.WorkingList || [];
      break;

    case ReportModeEnum.order:
      temp.Unit = TaskData.Working.OrderInfo?.Unit || '';
      temp.SecondTitle = TaskData.Working.OrderInfo?.Size || '';
      temp.WorkingList = TaskData.Working.OrderInfo?.WorkingList || [];

      if (TaskData.Working.TargetType === TargetTypeEnum.UnionChunk) {
        temp.Unit = TaskData.Working.ChunkInfo?.Unit || '';
      }

      break;

    case ReportModeEnum.block:
      temp.Unit = TaskData.Working.ChunkInfo?.Unit || '';
      temp.SecondTitle = TaskData.Working.ChunkInfo?.Size || '';
      temp.WorkingList = TaskData.Working.ChunkInfo?.WorkingList || [];
      break;

    default:
      break;
  }

  return temp;
};

/** 获取报工任务中的下一道工序信息 ( 用于非拆分工序 ) */
export const getNextWorkContent = (TaskData: ITaskDetail | null, index?: number) => {
  // if (!TaskData || TaskData.Working.Type === WorkingTypeEnum.split) { // 拆分工序
  //   return null;
  // }
  const _getInfo = (next: INextWorkingProduction) => {
    if (!next.Name) return null;
    const _temp = {
      NextWorkName: '',
      EquipmentName: '',
    };

    _temp.NextWorkName = next.Name;

    if (next.Equipment) {
      const _class = [next.Equipment.GroupName, next.Equipment.Name].filter(it => it).join('-');
      if (_class) {
        _temp.EquipmentName = _class;
      }
    }

    return _temp;
  };

  if (typeof index === 'number' && TaskData?.NextWorkingList[index]) {
    return _getInfo(TaskData.NextWorkingList[index]);
  }

  if (typeof index !== 'number' && TaskData?.NextWorkingList?.length === 1) {
    return _getInfo(TaskData.NextWorkingList[0]);
  }

  return null;
};
