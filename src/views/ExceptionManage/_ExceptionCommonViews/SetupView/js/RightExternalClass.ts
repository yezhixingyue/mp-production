import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ITaskExceptionDetail } from '../../js/type';
import { ExternalErrorLimitTypeEnum } from './enum';

/**
 * 外协处理表单类
 *
 * @export
 * @class RightExternalClass
 */
export class RightExternalClass {
  /** 外协减款金额 */
  ReduceAmount = ''

  /** 限制类型 = ['0', '1', '2'] */
  LimitType: ExternalErrorLimitTypeEnum = ExternalErrorLimitTypeEnum.None

  /** 工厂 */
  Factory = { ID: '' }

  /** 锁定金额 */
  FixedAmount = ''

  /** 修改加工信息 */
  ProcessContent = ''

  /** 当前外协工厂ID */
  _currentFactoryID = ''

  /** 锁定外协工厂ID */
  _FixedFactoryID = ''

  /** 是否锁定外协金额 */
  _IsFixedAmount = false

  /** 是否修改加工信息 */
  _IsChangeContent = false

  /** 当前工序可用的外协工厂  -- 列表数据待获取 */
  _FactoryList: { ID: string, Name: string }[] = []

  /** 当前工序外协的加工信息  -- 数据待获取 */
  _originProcessContent = ''

  constructor() {
    this.ProcessContent = this._originProcessContent; // 初始赋值
  }

  init(TaskExceptionDetail: ITaskExceptionDetail) {
    this._originProcessContent = TaskExceptionDetail.TaskDetail.Working.ExternalAttribute.ProcessContent || '';
    this.ProcessContent = this._originProcessContent;
    this._FactoryList = TaskExceptionDetail.TaskDetail.Working.UseableEquipmentList || [];
  }

  getSubmitData(TaskExceptionDetail: ITaskExceptionDetail | null) {
    if (!/^\d+(\.\d{1,2})?$/.test(this.ReduceAmount) && this.ReduceAmount !== '') {
      MpMessage.error('保存失败', '外协减款金额输入不正确，请输入数字类型且小数不能超过2位');
      return null;
    }

    const FinalAmount = TaskExceptionDetail?.TaskDetail.Working.ExternalAttribute?.FinalAmount;
    if (typeof FinalAmount === 'number') {
      if (+this.ReduceAmount > FinalAmount) {
        MpMessage.error('保存失败', `外协减款金额不能大于外协金额 ( ${FinalAmount}元 )`);
        return null;
      }
    }

    const temp: Partial<RightExternalClass> = {
      LimitType: this.LimitType,
    };

    if (this.ReduceAmount) {
      temp.ReduceAmount = this.ReduceAmount;
    }

    if (this.LimitType === ExternalErrorLimitTypeEnum.Fixed) {
      if (!this._FixedFactoryID) {
        MpMessage.error('保存失败', '请选择要锁定的外协工厂');
        return null;
      }
      temp.Factory = { ID: this._FixedFactoryID };
    }

    if (this._IsFixedAmount) {
      if (!this.FixedAmount) {
        MpMessage.error('保存失败', '请输入要锁定的外协金额');
        return null;
      }
      if (!/^\d+(\.\d{1,2})?$/.test(this.FixedAmount)) {
        MpMessage.error('保存失败', '要锁定的外协金额输入不正确，请输入数字类型且小数不能超过2位');
        return null;
      }
      temp.FixedAmount = this.FixedAmount;
    }

    if (this._IsChangeContent) {
      if (!this.ProcessContent) {
        MpMessage.error('保存失败', '请输入加工信息');
        return null;
      }
      temp.ProcessContent = this.ProcessContent;
    }
    return temp;
  }
}
