import { IEquipmentTaskInfo } from '@/views/ProductionClient/assets/js/types';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';

export const getTaskDisplayInfo = (TaskData: IEquipmentTaskInfo, withTemplate = true) => {
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
    TaskData.Working.OrderInfo?.Product,
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
