/** 数码拼版状态枚举  */
export enum DigitalImpositionStatusEnum {
  /** 待拼版 */
  WaitMakeup = 0,
  /** 已拼版 */
  HaveMakeup = 1,
  /** 已排程 */
  HaveScheduling = 2,
  /** 已打印工单 */
  HavePrint = 3,
  /** 已取消 */
  Canceled = 255,
}

/** 数码拼版状态枚举列表  */
export const DigitalImpositionStatusEnumList = [
  { ID: DigitalImpositionStatusEnum.WaitMakeup, Name: '未拼版' },
  { ID: DigitalImpositionStatusEnum.HaveMakeup, Name: '已拼版' },
  { ID: DigitalImpositionStatusEnum.HaveScheduling, Name: '已排程', printable: true },
  { ID: DigitalImpositionStatusEnum.HavePrint, Name: '已打印', printable: true },
  { ID: DigitalImpositionStatusEnum.Canceled, Name: '已取消' },
];

/** 数码拼版方式枚举 */
export enum DigitalImpositionTypeEnum {
  /** 系统拼版(含自动和拼版软件) */
  Auto = 0,
  /** 人工线下 */
  Manual = 1,
}

/** 数码拼版方式枚举列表 */
export const DigitalImpositionTypeEnumList = [
  { ID: DigitalImpositionTypeEnum.Auto, Name: '系统拼版' },
  { ID: DigitalImpositionTypeEnum.Manual, Name: '手工拼版' },
];
