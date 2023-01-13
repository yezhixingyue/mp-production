import { getEnumList } from '@/assets/js/utils/getListByEnums';
import { TaskListConditionCompareEnum } from './enum';

/** 时长筛选 */
export const TaskListConditionCompareEnumObj = {
  timeout: {
    ID: TaskListConditionCompareEnum.timeout,
    Name: '实际时长 > 预计时长',
  },
  timein: {
    ID: TaskListConditionCompareEnum.timein,
    Name: '实际时长 < 预计时长',
  },
};

export const TaskListConditionCompareEnumList = getEnumList(TaskListConditionCompareEnumObj);
