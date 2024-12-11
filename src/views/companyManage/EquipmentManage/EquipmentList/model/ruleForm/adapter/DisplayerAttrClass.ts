import { Toast } from '@/basic/decorator/validate/classDecorators';
import { MyValidationDecorator } from '@/basic/decorator/validate/MyValidationDecorator';
import { IsNotEmpty } from 'class-validator';
import { IAttrFormClass, IDisplayer } from '../../../types';

@Toast({ enable: false })
export class DisplayerAttrClass extends MyValidationDecorator implements IAttrFormClass {
  @IsNotEmpty({ message: '请输入设备型号' })
  model = ''

  constructor(item?: IDisplayer) {
    super();

    if (item) {
      this.model = item.attribute.model || '';
    }
  }

  getParams() {
    const temp = { ...this };
    return temp;
  }
}
