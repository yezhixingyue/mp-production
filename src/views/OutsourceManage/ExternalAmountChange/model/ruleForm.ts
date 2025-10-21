import { RuleFormIsRefusedEnum } from '../types/enum';
import { MenuEventType, TaskPriceCheckInfoRowType } from '../types/type';

/** 外协金额修改表单类 */
export class RuleForm {
  ID: number

  Price: string | number = ''

  /** 转移给的主管ID */
  ManagerID = ''

  /** 修改金额说明 | 调整复核意见 */
  Remark = ''

  /** 未通过 或者 驳回 */
  IsRefused: '' | RuleFormIsRefusedEnum | boolean = ''

  type: MenuEventType

  showManagerOnPriceChange = false

  constructor(row: TaskPriceCheckInfoRowType, type: MenuEventType) {
    this.ID = row.ID;
    this.type = type;

    if (this.type === 'confirm') {
      this.Remark = row.RecheckRemark;
    }
  }

  /** 获取表单提交数据 */
  getParams() {
    const temp: Partial<RuleForm> = { ...this };
    delete temp.type;
    delete temp.showManagerOnPriceChange;
    delete temp.getParams;

    switch (this.type) {
      case 'changePrice':
        delete temp.IsRefused;
        if (!this.showManagerOnPriceChange) {
          delete temp.ManagerID;
          delete temp.Remark;
        }

        temp.Price = Number(temp.Price);

        break;

      case 'check': // 主管审核
        delete temp.Price;
        delete temp.Remark;
        if (this.IsRefused !== RuleFormIsRefusedEnum.Other) {
          delete temp.ManagerID;
          temp.IsRefused = this.IsRefused === RuleFormIsRefusedEnum.True;
        } else {
          delete temp.IsRefused;
        }
        break;
      case 'confirm': // 财务确认
        delete temp.Price;
        delete temp.ManagerID;
        temp.IsRefused = this.IsRefused === RuleFormIsRefusedEnum.True;
        if (!temp.IsRefused) { // 没有被驳回时 -- 即确认修改时
          delete temp.Remark;
        }
        break;
      default:
        break;
    }

    return temp as Partial<Pick<RuleForm, 'ID' | 'ManagerID' | 'Price' | 'Remark'> & { IsRefused: boolean }>;
  }
}
