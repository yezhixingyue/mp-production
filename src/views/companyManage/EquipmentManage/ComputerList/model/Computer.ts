import { Toast } from '@/basic/decorator/validate/classDecorators';
import { MyValidationDecorator } from '@/basic/decorator/validate/MyValidationDecorator';
import { AllowEmpty } from '@/basic/decorator/validate/propertyDecorators';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { useUserStore } from '@/store/modules/user';
import { ComputerUseStateEnum } from '../types/enum';
import { IComputer } from '../types/type';

@Toast({ enable: false })
export class ComputerForm extends MyValidationDecorator {
  id?: string

  @IsNotEmpty({ message: '主机编号不能为空' })
  code = '';

  @Min(0, { message: '显示器数量不能小于0' })
  @Max(10, { message: '显示器数量不能大于10' })
  @IsInt({ message: '显示器数量格式不正确' })
  @IsNotEmpty({ message: '显示器数量不能为空' })
  displayNumber: number | '' = ''

  @IsNotEmpty({ message: '显示器编号不能为空' })
  displayCode = ''

  @IsNotEmpty({ message: '显示器型号不能为空' })
  displayModel = ''

  @IsNotEmpty({ message: 'ip地址不能为空' })
  @AllowEmpty()
  ip = ''

  @IsNotEmpty({ message: 'mac地址不能为空' })
  mac = ''

  @IsNotEmpty({ message: '请输入cpu型号' })
  cpu = ''

  @Min(0, { message: '插槽数量不能小于0' })
  @Max(10, { message: '插槽数量不能大于10' })
  @IsInt({ message: '插槽数量格式不正确' })
  @IsNotEmpty({ message: '请输入内存插槽数量' })
  memorySlotsNumber: number | '' = ''

  @IsNotEmpty({ message: '请输入内存型号' })
  memory = ''

  @IsNotEmpty({ message: '请输入硬盘型号' })
  disk = ''

  @Min(0, { message: '硬盘数量不能小于0' })
  @Max(10, { message: '硬盘数量不能大于10' })
  @IsInt({ message: '硬盘数量格式不正确' })
  @IsNotEmpty({ message: '请输入内存硬盘数量' })
  diskNumber: number | '' = ''

  @IsNotEmpty({ message: '请输入显卡型号' })
  graphicsCard = ''

  @IsNotEmpty({ message: '请输入网卡型号' })
  networkCard = ''

  @IsNotEmpty({ message: '请输入操作系统' })
  os = ''

  @IsNotEmpty({ message: '请输入系统盘类型' })
  systermDiskType = '' // SSD HDD

  // @IsNotEmpty({ message: '请输入采购来源' })
  source = '' // 来源

  purchaseAt = '' // 采购时间

  warrantyExpiredAt = '' // 保修过期时间

  state: ComputerUseStateEnum = ComputerUseStateEnum.leisure // 状态

  @IsNotEmpty({ message: '请选择使用人' })
  @AllowEmpty<IComputer>({ ifContinue: obj => obj.state === ComputerUseStateEnum.inUse })
  user = ''

  creator = ''

  constructor(originData: IComputer | null, isCopy: boolean) {
    super();

    if (!originData) return;

    Object.entries(originData).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(this, key) && (value || value === 0)) {
        this[key] = value;
      }
    });

    // 是否需要修正日期格式 ? - 暂不需要

    if (isCopy) { // 如果是拷贝方式新增
      this.id = undefined;
      this.user = '';
      this.state = ComputerUseStateEnum.inUse;
    }
  }

  getParams() {
    const erros = this.validate();
    if (erros.length > 0) return null;

    // if (!/^\d+$/.test(String(this.displayNumber))) return null;
    // if (!/^\d+$/.test(String(this.memorySlotsNumber))) return null;
    // if (!/^\d+$/.test(String(this.diskNumber))) return null;

    const temp: Omit<IComputer, 'createdAt' | 'updatedAt' | 'id' | 'index'> & { id?: string } = {
      ...this,
      displayNumber: Number(this.displayNumber),
      memorySlotsNumber: Number(this.memorySlotsNumber),
      diskNumber: Number(this.diskNumber),
    };

    if (!temp.id) {
      temp.creator = useUserStore().user?.StaffID || '';
    }

    return temp;
  }
}
