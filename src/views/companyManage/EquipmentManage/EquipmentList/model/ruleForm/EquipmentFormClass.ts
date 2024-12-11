import { Toast } from '@/basic/decorator/validate/classDecorators';
import { MyValidationDecorator } from '@/basic/decorator/validate/MyValidationDecorator';
import { AllowEmpty } from '@/basic/decorator/validate/propertyDecorators';
import { IsNotEmpty } from 'class-validator';
import { useUserStore } from '@/store/modules/user';
import { IComputer, IDisplayer, TEquipment } from '../../types';
import { EquipmentStatusEnum, EquipmentTypeEnum } from '../../types/enum';
import { ComputerAttrClass } from './adapter/ComputerAttrClass';
import { DisplayerAttrClass } from './adapter/DisplayerAttrClass';

@Toast({ enable: false })
export class EquipmentFormClass extends MyValidationDecorator {
  id = ''

  /** 标签编号 */
  @IsNotEmpty({ message: '设备编号不能为空' })
  code = ''

  status = EquipmentStatusEnum.inUse

  /** 供应商 */
  supplier = ''

  /** 采购时间 */
  purchaseAt = ''

  /** 保修到期时间 */
  warrantyExpiredAt = ''

  /** 备注 */
  remark = ''

  @IsNotEmpty({ message: '请选择使用人' })
  @AllowEmpty<TEquipment>({ ifContinue: obj => obj.status === EquipmentStatusEnum.inUse })
  user = ''

  creator = ''

  private type = EquipmentTypeEnum.computer

  attribute: null | ComputerAttrClass | DisplayerAttrClass = null

  get Type() {
    return this.type;
  }

  set Type(type: EquipmentTypeEnum) {
    if (type === this.type) return;

    this.type = type;

    this._adaptive();
  }

  constructor(item: TEquipment | undefined | null, type: string | number) { // 可能的参数： 1. 编辑项目数据  2. 如果为新增-初始默认设备类型
    super();

    // 参数还原
    if (item) {
      this.id = item.id;
      this.type = item.type;
      this.code = item.code;
      this.supplier = item.supplier || '';
      this.status = item.status;
      this.remark = item.remark;
      this.creator = item.creator;
      this.user = item.user || '';
      this.purchaseAt = item.purchaseAt || '';
      this.warrantyExpiredAt = item.warrantyExpiredAt || '';
    } else if (typeof type === 'number') {
      this.type = type;
    }

    this._adaptive(item);
  }

  private _adaptive(item?: TEquipment | null) {
    switch (this.type) {
      case EquipmentTypeEnum.computer:
        this.attribute = new ComputerAttrClass(item as IComputer);
        break;

      case EquipmentTypeEnum.displayer:
        this.attribute = new DisplayerAttrClass(item as IDisplayer);
        break;

      default:
        this.attribute = null;
        break;
    }
  }

  getParams() {
    const temp = { ...this };

    // 1. 根据状态处理user
    if (temp.status === EquipmentStatusEnum.leisure) temp.user = '';

    // 2. 处理creator -- 区分编辑还是添加
    if (!this.id) { // 编辑模式
      temp.creator = useUserStore().user?.StaffID || '';
    }

    // 3. 处理attribute
    if (this.attribute) temp.attribute = this.attribute.getParams();

    return temp;
  }
}
