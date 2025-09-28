import { useTimeSelectModuleStore } from './timeSelectModule';

const store = useTimeSelectModuleStore();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ISetConditionParams = [[string, string | undefined], any];

export default class CommonClassType {
  static setDate(obj, key = 'Date', defalutProps = { First: 'First', Second: 'Second' }, DateTypeField = 'DateType') {
    const _obj = obj;

    store.updateNewDate();

    switch (obj[DateTypeField]) {
      case 'all':
        _obj[key][defalutProps.First] = store.AlltimeDate.First;
        _obj[key][defalutProps.Second] = store.AlltimeDate.Second;
        break;
      case 'today':
        _obj[key][defalutProps.First] = store.TodayDate.First;
        _obj[key][defalutProps.Second] = store.TodayDate.Second;
        break;
      // 明天
      case 'tomorrow':
        _obj[key][defalutProps.First] = store.TomorrowDate.First;
        _obj[key][defalutProps.Second] = store.TomorrowDate.Second;
        break;
      // 后天
      case 'theDayAfterTomorrow':
        _obj[key][defalutProps.First] = store.TheDayAfterTomorrow.First;
        _obj[key][defalutProps.Second] = store.TheDayAfterTomorrow.Second;
        break;
      // 未来七天
      case 'next7Date':
        _obj[key][defalutProps.First] = store.Next7Date.First;
        _obj[key][defalutProps.Second] = store.Next7Date.Second;
        break;
      case 'yesterday':
        _obj[key][defalutProps.First] = store.YesterdayDate.First;
        _obj[key][defalutProps.Second] = store.YesterdayDate.Second;
        break;
      case 'beforeyesterday':
        _obj[key][defalutProps.First] = store.BeforeYesterdayTimeDate.First;
        _obj[key][defalutProps.Second] = store.BeforeYesterdayTimeDate.Second;
        break;
      case 'curWeek':
        _obj[key][defalutProps.First] = store.curWeekDate.First;
        _obj[key][defalutProps.Second] = store.curWeekDate.Second;
        break;
      case 'lastWeek':
        _obj[key][defalutProps.First] = store.lastWeekDate.First;
        _obj[key][defalutProps.Second] = store.lastWeekDate.Second;
        break;
      case 'curMonth':
        _obj[key][defalutProps.First] = store.curMonthDate.First;
        _obj[key][defalutProps.Second] = store.curMonthDate.Second;
        break;
      case 'lastMonth':
        _obj[key][defalutProps.First] = store.lastMonthDate.First;
        _obj[key][defalutProps.Second] = store.lastMonthDate.Second;
        break;
      case 'toYear': // 今年
        _obj[key][defalutProps.First] = store.toYearDate.First;
        _obj[key][defalutProps.Second] = store.toYearDate.Second;
        break;
      case 'lastYear': // 去年
        _obj[key][defalutProps.First] = store.lastYearDate.First;
        _obj[key][defalutProps.Second] = store.lastYearDate.Second;
        break;
      case 'beforeyesterYear': // 前年
        _obj[key][defalutProps.First] = store.beforeyesterYearDate.First;
        _obj[key][defalutProps.Second] = store.beforeyesterYearDate.Second;
        break;
      default:
        if (store[obj[DateTypeField]]) {
          _obj[key][defalutProps.First] = store[obj[DateTypeField]].First;
          _obj[key][defalutProps.Second] = store[obj[DateTypeField]].Second;
        }
        break;
    }
  }

  static filter(obj, bool = true, DateTypeFields = ['DateType']) { // 布尔值用于判断是否保留value为0的键值对，为true时保留，为false不保留
    const _tempObj = {};
    if (!obj) return {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
        if ((obj[key] && !DateTypeFields.includes(key)) || (bool && obj[key] === 0) || obj[key] === false) _tempObj[key] = obj[key];
      } else {
        const _t = obj[key];
        Object.keys(_t).forEach(subKey => {
          if (_t[subKey]) {
            if (!_tempObj[key]) _tempObj[key] = {};
            _tempObj[key][subKey] = _t[subKey];
          }
        });
      }
    });
    return _tempObj;
  }

  static setCondition([[key1, key2], val]: ISetConditionParams, condition: object) { // 设置条件值
    if (!condition || typeof condition !== 'object') {
      throw new Error('condition is an invalid parameter');
    }

    if (!key1 || !Object.hasOwnProperty.call(condition, key1)) {
      throw new Error('key1 is an invalid parameter');
    }

    if (key2 && !Object.hasOwnProperty.call(condition[key1], key2)) {
      throw new Error('key2 is an invalid parameter');
    }

    const _condition = condition;

    if (key2) {
      _condition[key1][key2] = val;
    } else {
      _condition[key1] = val;
    }
  }
}
