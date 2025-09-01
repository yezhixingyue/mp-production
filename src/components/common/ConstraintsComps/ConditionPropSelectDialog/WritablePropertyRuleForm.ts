import { MpMessage } from '@/assets/js/utils/MpMessage';
import { PropertyListItemType } from '../TypeClass/Property';

export class WritablePropertyRuleForm {
  DisplayContent = ''

  Unit = ''

  writableProperty: PropertyListItemType

  constructor(writableProperty: PropertyListItemType) {
    this.writableProperty = writableProperty;
  }

  getParams(WrittenPropertyNames: string[] = []) {
    if (!this.DisplayContent) {
      MpMessage.error('添加失败', '请输入参数名称');
      return null;
    }

    // 正则表达式：仅允许数字、字母和汉字
    const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
    if (!regex.test(this.DisplayContent)) {
      MpMessage.error('添加失败', '参数名称仅允许数字、字母和汉字组成');
      return null;
    }

    const DisplayContent = `[${this.DisplayContent}]`;

    if (WrittenPropertyNames.includes(DisplayContent)) {
      MpMessage.error('添加失败', '参数名称重复');
      return null;
    }

    return {
      ...this.writableProperty,
      DisplayContent,
      Unit: this.Unit,
    };
  }
}
