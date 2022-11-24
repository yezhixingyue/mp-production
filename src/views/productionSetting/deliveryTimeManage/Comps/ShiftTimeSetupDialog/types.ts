export interface ISType {
  /** 小时 */
  F: string | number,
  /** 分钟 */
  S: string | number,
}
export interface IShiftType {
  key?: string,
  date?: string,
  S: ISType,
  D: number,
  H: number,
}
