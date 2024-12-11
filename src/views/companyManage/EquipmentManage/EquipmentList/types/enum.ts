/** 设备类型枚举 */
export enum EquipmentTypeEnum {
  /** 电脑主机 */
  computer = 0,
  /** 显示器 */
  displayer = 1,
}

/** 设备类型枚举列表 */
export const EquipmentTypeEnumList = [
  { ID: EquipmentTypeEnum.computer, Name: '电脑主机' },
  { ID: EquipmentTypeEnum.displayer, Name: '显示器' },
];

/** 设备状态枚举 */
export enum EquipmentStatusEnum {
  /** 空闲 */
  leisure = 0,
  /** 使用中 */
  inUse = 1,
  /** 已作废 */
  abandoned = 2,
  /** 已调出 */
  calledout = 3,
  /** 维修中 */
  // inMaintenance = 4,
}

export const EquipmentStatusEnumList = [
  { ID: EquipmentStatusEnum.leisure, Name: '空闲', color: '#888' },
  { ID: EquipmentStatusEnum.inUse, Name: '使用中', color: '#80c269' },
  { ID: EquipmentStatusEnum.abandoned, Name: '已作废', color: '#cbcbcb' },
  { ID: EquipmentStatusEnum.calledout, Name: '已调出', color: '#cbcbcb' },
  // { ID: EquipmentStatusEnum.inMaintenance, Name: '维修中', color: '#f4a307' },
];

/** 设备历史记录操作类型枚举： 创建 | 修改 | 作废 | 调出 | 调入 */
export enum EquipmentHistoryTypeEnum {
  /** 创建 */
  create = 0,
  /** 修改 */
  update = 1,
  /** 作废 */
  abandon = 2,
  /** 调出 */
  callout = 3,
  /** 调入 */
  callin = 4,
  /** 维修 */
  // inMaintenance = 5,
}

export const EquipmentHistoryTypeEnumList = [
  { ID: EquipmentHistoryTypeEnum.create, Name: '创建' },
  { ID: EquipmentHistoryTypeEnum.update, Name: '修改' },
  { ID: EquipmentHistoryTypeEnum.abandon, Name: '作废' },
  { ID: EquipmentHistoryTypeEnum.callout, Name: '调出' },
  { ID: EquipmentHistoryTypeEnum.callin, Name: '调入' },
  // { ID: EquipmentHistoryTypeEnum.callin, inMaintenance: '维修' },
];
