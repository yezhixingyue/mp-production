import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ExternalTaskDateTypeRadioEnum, ExternalTaskStatusEnum } from './enum';
import { ISwitchOptions } from './type';

/** 外协列表筛选条件仅页面使用的生产线类型枚举 */
export enum _OutsourceConditionLineTypeEnum {
  /** 生产线 */
  Line = 1,
  /** 组合生产线 */
  CombineLine = 3,
  /** 制版组 */
  MakingGroup = 2,
}

export class Condition {
  /** 外协工厂 */
  Catalog = {
    ID: '',
  }

  Line: { _Type: '' | _OutsourceConditionLineTypeEnum; First: string | number; Second: string | number; } = { // 生产线 与 工序
    _Type: '',
    First: '',
    Second: '',
  }

  /** 创建时间 */
  CreateTime = {
    First: '',
    Second: '',
  }

  /** 状态 */
  Status: ExternalTaskStatusEnum | '' = ''

  DateType: string

  DateTypeRadio = ExternalTaskDateTypeRadioEnum.Create

  KeyWords = ''

  Page = 1

  PageSize = 20

  ExternalStatus: ExternalTaskStatusEnum | '' = ''

  /** 确认外协操作人 */
  SendOperator = ''

  _options: ISwitchOptions

  constructor(options: ISwitchOptions) {
    this.DateType = options.showDate ? 'today' : '';
    this.Status = options.Status;
    this._options = options;
  }

  filter() {
    // 处理时间
    if (this._options.showDate) {
      CommonClassType.setDate(this, 'CreateTime');
    }

    // 筛选结果
    const temp: Partial<Condition> & { WishFinishTime?: Condition['CreateTime'] } = CommonClassType.filter(this);

    if (this._options.showDate && this.DateTypeRadio === ExternalTaskDateTypeRadioEnum.ExpectedFinish) {
      temp.WishFinishTime = temp.CreateTime;
      delete temp.CreateTime;
    }

    delete temp.DateTypeRadio;
    delete temp._options;

    // 如果是制版组筛选  对First和Second进行一下值的调换（因为一般生产线是生产线在前工序在其内部，但制版组却是工序在前制版组（约可认为是生产线）在其内部）
    if (temp.Line && temp.Line._Type === _OutsourceConditionLineTypeEnum.MakingGroup) {
      const { First, Second } = temp.Line;
      temp.Line.First = Second; // 可能会出现Second有值 但First为undefined的情况
      temp.Line.Second = First;
    }

    return temp;
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
