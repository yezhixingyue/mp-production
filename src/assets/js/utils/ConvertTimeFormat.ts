/**
 * 时间格式转换函数
 *
 * @param {*} date 传入new Date()或同类型时间参数  如："Sat Jan 11 2020 16:01:46 GMT+0800 (中国标准时间)"
 * @returns 返回转换后的时间格式："2020-01-11"
 */
export function ConvertTimeFormat(date: Date) {
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const strDate = (`0${date.getDate()}`).slice(-2);
  const currentdate = `${date.getFullYear()}-${month}-${strDate}`;
  return currentdate;
}

/**
 * 传入一个时间，获取其第二天的时间并转换其时间格式
 *
 * @export
 * @param {*} date
 * @returns 返回第二天时间，格式类型："2020-01-12"
 */
export function getSecondTime(date: Date) {
  return ConvertTimeFormat(new Date(date.getTime() + 1000 * 60 * 60 * 24));
}

/** 把以分钟为单位的时间数字转换为*天*小时*分钟的文字显示格式 */
export const transformMinute = (Duration: number) => {
  if (typeof Duration !== 'number') return '';

  const day = Math.floor(Duration / (60 * 24));

  const hour = Math.floor((Duration - day * 60 * 24) / (60));

  const minute = Math.floor(Duration - day * 60 * 24 - hour * 60);

  return `${day ? `${day}天` : ''}${hour ? `${hour}小时` : ''}${minute}分钟`;
};
