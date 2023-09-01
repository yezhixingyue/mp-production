// import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { TaskListConditionCompareEnum } from './enum';

export class Condition {
  /** 生产设备相关 */
  Catalog: { ClassID: '' | number; GroupID: string; ID: string } = {
    ClassID: '',
    GroupID: '',
    ID: '',
  }

  /** 操作人 */
  Operator = ''

  /** 完成时间 */
  FinishTime = {
    First: '',
    Second: '',
  }

  /** 时长筛选 */
  Compare: '' | TaskListConditionCompareEnum = ''

  /** 状态 */
  // StatusList = [
  //   // ProductiveTaskStatusEnum.InProduction,
  //   // ProductiveTaskStatusEnum.Error,
  //   ProductiveTaskStatusEnum.Finished,
  //   // ProductiveTaskStatusEnum.HaveCancled,
  //   // ProductiveTaskStatusEnum.Initial,
  //   // ProductiveTaskStatusEnum.Producibility,
  // ]

  DateType = 'last7Date'

  KeyWords = ''

  Page = 1

  PageSize = 20

  filter() {
    /** 处理时间 */
    CommonClassType.setDate(this, 'FinishTime');

    /** 筛选结果 */
    return CommonClassType.filter(this);
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
