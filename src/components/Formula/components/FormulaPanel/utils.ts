import { MpMessage } from '@/assets/js/utils/MpMessage';

/** 校验公式内容是否合法 */
export const validateFormulaContent = (Content: string, tipTitle: string) => {
  if (!Content) {
    MpMessage.error(tipTitle, '请填写公式内容');
    return false;
  }

  const NotChineseWideCharReg = /[^\u4e00-\u9fa5\x20-\xff]/gm; // 非中文全角字符

  const matchResArr = Content.match(NotChineseWideCharReg);
  if (matchResArr) {
    MpMessage.error(tipTitle, `公式中[ ${matchResArr} ]等字符为全角字符，请转换为半角`);
    return false;
  }

  return true;
};
