import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';
import { TaskListConditionCompareEnum } from '../../ManageTaskListPage/js/enum';

/** 数码工单打印列表条件 */
export class Condition {
  /** 是否版报工工序 */
  IsPlateTask: boolean

  Line = { // 生产线 与 工序
    First: '',
    Second: '',
  }

  Catalog = { // 设备筛选
    ClassID: '',
    GroupID: '',
    ID: '',
  }

  Operator = ''

  KeyWords = ''

  FinishTime = { // 完成时间
    First: '',
    Second: '',
  }

  DateType = 'today'

  /** 时长筛选 */
  Compare: '' | TaskListConditionCompareEnum = ''

  Page = 1

  PageSize = 20

  StatusList = [ProductiveTaskStatusEnum.Finished]

  constructor(IsPlateTask: boolean) {
    this.IsPlateTask = IsPlateTask;
  }

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
