import { useTimeSelectModuleStore } from './timeSelectModule';

const store = useTimeSelectModuleStore();

export default class CommonClassType {
  static setDate(obj, key = 'Date', defalutProps = { First: 'First', Second: 'Second' }) {
    console.log(obj);

    const _obj = obj;
    switch (obj.DateType) {
      case 'all':
        _obj[key][defalutProps.First] = store.AlltimeDate.First;
        _obj[key][defalutProps.Second] = store.AlltimeDate.Second;
        break;
      case 'today':
        _obj[key][defalutProps.First] = store.TodayDate.First;
        _obj[key][defalutProps.Second] = store.TodayDate.Second;
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
      default:
        if (store[obj.DateType]) {
          _obj[key][defalutProps.First] = store[obj.DateType].First;
          _obj[key][defalutProps.Second] = store[obj.DateType].Second;
        }
        break;
    }
  }

  static filter(obj, bool = false) { // 布尔值用于判断是否保留value为0的键值对，为true时保留，为false不保留
    const _tempObj = {};
    // console.log(obj);
    if (!obj) return {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) !== '[object Object]') {
        if ((obj[key] && key !== 'DateType') || (bool && obj[key] === 0)) _tempObj[key] = obj[key];
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
}
