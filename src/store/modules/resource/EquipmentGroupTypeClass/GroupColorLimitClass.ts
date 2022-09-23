import { MpMessage } from '@/assets/js/utils/MpMessage';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export class GroupColorLimitClass {
  ID = ''

  ColorLimitContent = ''

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }
  // 后面添加校验等方法

  validate(oldVal: string) {
    if (this.ColorLimitContent === oldVal) {
      MpMessage.error({ title: '保存失败', msg: '设置未变化' });
      return false;
    }
    if (this.ColorLimitContent) {
      const regxp = /^[123456789]\d*(,[123456789]\d*)*$/;
      if (!regxp.test(this.ColorLimitContent)) {
        MpMessage.error({ title: '保存失败', msg: '输入格式不正确，请参照格式要求说明' });
        return false;
      }
      const arr = this.ColorLimitContent.split(',').map(it => +it);
      const t = arr.find(num => num > 30);
      if (t) {
        MpMessage.error({ title: '保存失败', msg: '单个印色数值不能超过30色' });
        return false;
      }
      const len1 = arr.length;
      const len2 = [...new Set([...arr])].length;
      if (len1 > len2) {
        MpMessage.error({ title: '保存失败', msg: '存在重复项' });
        return false;
      }
    }
    return true;
  }
}
