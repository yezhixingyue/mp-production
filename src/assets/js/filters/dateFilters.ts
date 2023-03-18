/**
 * 转换长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59:59
 */
export const format2LangTypeDate = (date: string) => {
  if (!date) return '';
  const result = date.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

  return result?.[0] ? result?.[0].replace('T', ' ') : '';
};

/**
 * 转换中长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59
 */
export const format2MiddleLangTypeDateFunc2 = (date: string) => {
  if (!date) return '';
  const result = date.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);

  return result?.[0] ? result?.[0].replace('T', ' ') : '';
};

/**
 * 转换类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24
 */
export const formatOnlyDate = (date: string) => {
  if (!date) return '';
  const result = date.match(/\d{4}-\d{2}-\d{2}/);

  return result?.[0] ? result?.[0] : '';
};

export default {
  format2LangTypeDate,
  format2MiddleLangTypeDateFunc2,
};
