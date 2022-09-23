import { MpMessage } from '@/assets/js/utils/MpMessage';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export class GroupSizeLimitClass {
  ID = ''

  MinWidth: number|'' = ''

  MaxWidth: number|'' = ''

  MinLength: number|'' = ''

  MaxLength: number|'' = ''

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }

  validate() {
    const regxp = /^[123456789]+\d*$|-1/;

    const {
      MinLength, MinWidth, MaxLength, MaxWidth,
    } = this;

    let minIsSet = false;
    let maxIsSet = false;

    if (MinLength !== '' && MinWidth !== '') {
      // 设置了最小尺寸
      if (!regxp.test(MinLength.toString()) || !regxp.test(MinWidth.toString())) {
        MpMessage.error({ title: '保存失败', msg: '最小尺寸长宽设置格式不正确' });
        return false;
      }
      if (MinLength === -1 || MinWidth === -1) {
        MpMessage.error({ title: '保存失败', msg: '最小尺寸长和宽不可设置为无限' }); // 此处验证待确认 是否可以设置为-1
        return false;
      }
      minIsSet = true;
    } else if (MinLength !== '' || MinWidth !== '') {
      MpMessage.error({ title: '保存失败', msg: '最小尺寸长宽设置不完整' });
      return false;
    }

    if (MaxLength !== '' && MaxWidth !== '') {
      // 设置了最小尺寸
      if (!regxp.test(MaxLength.toString()) || !regxp.test(MaxWidth.toString())) {
        MpMessage.error({ title: '保存失败', msg: '最大尺寸长宽设置格式不正确' });
        return false;
      }
      maxIsSet = true;
    } else if (MaxLength !== '' || MaxWidth !== '') {
      MpMessage.error({ title: '保存失败', msg: '最大尺寸长宽设置不完整' });
      return false;
    }

    if (minIsSet && maxIsSet) {
      if (MaxLength < MinLength && MaxLength !== -1) {
        MpMessage.error({ title: '保存失败', msg: '最大尺寸长不能小于最小尺寸长' });
        return false;
      }
      if (MaxWidth < MinWidth && MaxWidth !== -1) {
        MpMessage.error({ title: '保存失败', msg: '最大尺寸宽不能小于最小尺寸宽' });
        return false;
      }
    }

    return true;
  }
}
