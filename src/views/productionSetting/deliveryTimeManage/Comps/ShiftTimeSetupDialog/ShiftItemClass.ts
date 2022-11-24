import { IShiftType, ISType } from './types';

export class ShiftItemClass {
  S: ISType = {
    F: '',
    S: '',
  }

  _date = ''

  public _key: string

  constructor(data: IShiftType | null) {
    this._key = Math.random().toString(16).slice(-10);
    if (data) {
      this.S.F = data.S.F;
      this.S.S = data.S.S;
      this._date = ShiftItemClass.getFormatValue(data.S);
    }
  }

  static getFormatValue(SItem: ISType) {
    if (!SItem) return '';
    const { F, S } = SItem;
    if ((!F && F !== 0) || (!S && S !== 0)) return '';
    const _f = `0${F}`.slice(-2);
    const _s = `0${S}`.slice(-2);
    return `${_f}:${_s}`;
  }
}
