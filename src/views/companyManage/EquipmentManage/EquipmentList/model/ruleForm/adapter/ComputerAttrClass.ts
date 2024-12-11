import { Toast } from '@/basic/decorator/validate/classDecorators';
import { MyValidationDecorator } from '@/basic/decorator/validate/MyValidationDecorator';
import { AllowEmpty } from '@/basic/decorator/validate/propertyDecorators';
import { IsNotEmpty, Min, Max, IsInt } from 'class-validator';
import { IAttrFormClass, IComputer } from '../../../types';

@Toast({ enable: false })
export class ComputerAttrClass extends MyValidationDecorator implements IAttrFormClass {
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

  @IsNotEmpty({ message: '请输入内存' })
  memory = ''

  @Min(0, { message: '硬盘数量不能小于0' })
  @Max(10, { message: '硬盘数量不能大于10' })
  @IsInt({ message: '硬盘数量格式不正确' })
  @IsNotEmpty({ message: '请输入内存硬盘数量' })
  diskNumber: number | '' = ''

  @IsNotEmpty({ message: '请输入硬盘型号' })
  disk = ''

  @IsNotEmpty({ message: '请输入显卡' })
  graphicsCard = ''

  @IsNotEmpty({ message: '请输入网卡' })
  networkCard = ''

  @IsNotEmpty({ message: '请输入操作系统' })
  os = ''

  @IsNotEmpty({ message: '请输入系统盘类型' })
  systermDiskType = '' // SSD HDD

  constructor(item?: IComputer) {
    super();

    if (item) {
      Object.entries(item.attribute).forEach(([key, value]) => {
        if (value || (value !== null && value !== undefined)) { // 有值时
          this[key] = value;
        }
      });
    }
  }

  getParams() {
    return { ...this };
  }
}
