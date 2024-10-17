export const getOnlyDateFormat = (date?: string) => {
  if (date && /^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);

  return date || '';
};

export const getDateTimeFormat = (date?: string) => {
  if (date) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(date) && date.endsWith('Z')) {
      const _date = getOnlyDateFormat(date);
      const _time = new Date(date).toLocaleTimeString().slice(0, 5);
      return `${_date} ${_time}`;
    }
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(date)) {
      return date.slice(0, 16);
    }
  }

  return '';
};
