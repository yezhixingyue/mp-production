import { getEnumNameByIDAndEnumList } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { ShiftTypeEnum, ShiftTypeEnumList } from '../../enums';
import { IShiftRowItem, IShiftTime } from '../../types';

export interface IShiftTimeInDialog extends IShiftTime {
  _key: string
  _date: string
}

export const weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']; // 从1开始

export class ShiftItemClass implements IShiftRowItem {
  ShiftID = ''

  ShiftTime: IShiftTimeInDialog[] = []

  ShiftType: ShiftTypeEnum = ShiftTypeEnum.everyday

  TypeLimit: number[] = [];

  _WeekTypeLimit: number[] = []

  _MonthTypeLimit: number[] = []

  constructor(data: IShiftRowItem | null) {
    if (data) {
      restoreInitDataByOrigin(this, data);
      switch (this.ShiftType) {
        case ShiftTypeEnum.weekly:
          this._WeekTypeLimit = [...this.TypeLimit];
          break;

        case ShiftTypeEnum.monthly:
          this._MonthTypeLimit = [...this.TypeLimit];
          break;

        default:
          break;
      }
      this.ShiftTime = this.ShiftTime.map(it => ({
        ...it,
        _key: Math.random().toString(16).slice(-10),
        _date: ShiftItemClass.getFormatValue(it),
      }));
    }
  }

  addOneNewShiftTime() {
    const temp: IShiftTimeInDialog = {
      First: '',
      Second: '',
      _key: Math.random().toString(16).slice(-10),
      _date: '',
    };
    this.ShiftTime.push(temp);
  }

  private _check() {
    if (this.ShiftType === ShiftTypeEnum.weekly && this._WeekTypeLimit.length === 0) {
      MpMessage.error({
        title: '操作失败',
        msg: '请选择每周时间',
      });
      return false;
    }
    if (this.ShiftType === ShiftTypeEnum.monthly && this._MonthTypeLimit.length === 0) {
      MpMessage.error({
        title: '操作失败',
        msg: '请选择日期',
      });
      return false;
    }
    if (this.ShiftTime.length === 0) {
      MpMessage.error({
        title: '操作失败',
        msg: '请添加发车时间点',
      });
      return false;
    }
    const t = this.ShiftTime.find(it => !it._date);
    if (t) {
      MpMessage.error({
        title: '操作失败',
        msg: '发车时间点设置不完整，请检查',
      });
      return false;
    }
    const arr1 = this.ShiftTime.map(it => it._date);
    const arr2 = [...new Set(arr1)];
    if (arr1.length > arr2.length) {
      MpMessage.error({
        title: '操作失败',
        msg: '发车时间点设置重复，请检查',
      });
      return false;
    }
    return true;
  }

  private _getSubmitParams() {
    // 1. 转换ShiftTime数据
    this.ShiftTime.forEach(it => {
      if (!it._date) return;
      const [First, Second] = it._date.split(':');
      const _it = it;
      _it.First = First ? +First : '';
      _it.Second = Second ? +Second : '';
    });

    // 2. TypeLimit确定赋值
    let TypeLimit: number[] = [];
    switch (this.ShiftType) {
      case ShiftTypeEnum.weekly:
        TypeLimit = [...this._WeekTypeLimit];
        break;

      case ShiftTypeEnum.monthly:
        TypeLimit = [...this._MonthTypeLimit];
        break;

      default:
        break;
    }
    // 3. 对TypeLimit进行排序
    TypeLimit.sort((a, b) => a - b);

    const temp: IShiftRowItem = {
      ShiftID: this.ShiftID,
      ShiftTime: this.ShiftTime.map(it => ({ First: it.First, Second: it.Second })),
      ShiftType: this.ShiftType,
      TypeLimit,
    };
    return temp;
  }

  submit() {
    if (!this._check()) return null;
    const data = this._getSubmitParams();

    return data;
  }

  /**
   * 传入一个时间点对象，生成其对应的展示文字
   *
   * @static
   * @param {IShiftTime} shiftTime { First: 1, Second: 20 }
   * @returns
   * @memberof ShiftItemClass
   */
  static getFormatValue(shiftTime: IShiftTime) {
    if (!shiftTime) return '';
    const { First, Second } = shiftTime;
    if ((!First && First !== 0) || (!Second && Second !== 0)) return '';
    const _f = `0${First}`.slice(-2);
    const _s = `0${Second}`.slice(-2);
    return `${_f}:${_s}`;
  }

  /**
   * 通过一个ShiftTimeList列表 获取 其用来展示的内容文字
   *
   * @static
   * @param {IShiftRowItem[]} ShiftTimeList
   * @returns
   * @memberof ShiftItemClass
   */
  static getShiftTimeContentList(ShiftTimeList: IShiftRowItem[]) {
    const list = ShiftTimeList.map(it => {
      const _ShiftTypeName = getEnumNameByIDAndEnumList(it.ShiftType, ShiftTypeEnumList);
      let _ShiftTypeContent = '';
      switch (it.ShiftType) {
        case ShiftTypeEnum.weekly:
          _ShiftTypeContent = weekList.filter((_it, i) => it.TypeLimit.includes(i + 1)).join('、');
          break;

        case ShiftTypeEnum.monthly:
          _ShiftTypeContent = it.TypeLimit.map(num => `${num}号`).join('、');
          break;

        default:
          break;
      }
      const label = _ShiftTypeContent ? `${_ShiftTypeName}：${_ShiftTypeContent}` : _ShiftTypeName;
      const _arr = it.ShiftTime.map(t => ShiftItemClass.getFormatValue(t));
      const content = _arr.join('、');
      const key = Math.random().toString(16).slice(-10);
      return { label, content, key };
    });

    return list;
  }
}
