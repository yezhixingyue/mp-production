/** 获取日期字符串中的日期部分 */
export const getDate = (dateString: string) => {
  const _content = dateString.split('.')[0];
  return _content.split('T')[0];
};

/** 获取日期字符串中的时间点部分 ( 根据传入的配置信息进行生成 ) */
export const getTime = (dateString: string, options?: { onlyDate: boolean, withTime: boolean, isBegin: boolean }) => {
  if (options?.onlyDate) return '';
  const _content = dateString.split('.')[0];
  const _timeContent = _content.split('T')[1];
  if (!_timeContent && options && !options.withTime) { // 时间点不存在 或者 根据配置生成
    if (options.isBegin) {
      return '00:00:00';
    }
    return '23:59:59';
  }
  return _timeContent || '';
};

/** 时间边界 */
interface ITimeBoundary {
  Name: string,
  Date: Date
}

/**
 *
 *
 * @param {string} dateString
 * @param {string} [title]
 * @param {ITimeBoundary} [EarliestTime] [时间边界]：最早时间， 示例： { Name： '当前时间', Date: new Date() }
 * @param {ITimeBoundary} [LatestTime] [时间边界]：最晚时间
 * @returns
 */
export const validateDateValue = (dateString: string, title: string, EarliestTime?: ITimeBoundary, LatestTime?: ITimeBoundary) => {
  const _date = getDate(dateString);
  if (!_date) {
    return `${title || ''}未选择日期`;
  }
  const _time = getTime(dateString);

  if (!_time) {
    return `${title || ''}未选择时间点`;
  }

  if (EarliestTime && new Date(EarliestTime.Date) && new Date(dateString) < new Date(EarliestTime.Date)) {
    return `${title || ''}不能早于${EarliestTime.Name}`;
  }

  if (LatestTime && new Date(LatestTime.Date) && new Date(dateString) > new Date(LatestTime.Date)) {
    return `${title || ''}不能晚于${LatestTime.Name}`;
  }

  return true;
};
