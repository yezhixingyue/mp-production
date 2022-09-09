/**
 * 转换长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59:59
 */
export const format2LangTypeDate = date => {
  if (!date) return '';
  const _arr = date.split('T');
  const [t1, t2s] = _arr;
  const t2 = t2s.split('.')[0];
  return `${t1} ${t2}`;
};
/**
 * 转换中长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59
 */
export const format2MiddleLangTypeDateFunc2 = date => {
  if (!date) return '';
  const _arr = date.split('T');
  const [t1, t2s] = _arr;
  const t2 = t2s.split('.')[0].slice(0, -3);
  return `${t1}  ${t2}`;
};
export default {
  format2LangTypeDate,
  format2MiddleLangTypeDateFunc2,
};
