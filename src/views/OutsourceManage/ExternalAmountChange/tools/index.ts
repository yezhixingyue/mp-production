import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { TaskPriceCheckStatusEnumList } from '../types/enum';
import { ITaskPriceCheckInfo } from '../types/type';

export const getTableDataList = (list: ITaskPriceCheckInfo[]) => list.map(it => ({
  ...it,
  _StatusText: TaskPriceCheckStatusEnumList.find(item => item.ID === it.Status)?.Name || '',
  _TaskDetail: getLocalTaskList([it.TaskDetail], false, true)[0],
}));
