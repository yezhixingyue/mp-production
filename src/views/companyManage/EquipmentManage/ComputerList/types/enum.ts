/** 电脑使用状态 */
export enum ComputerUseStateEnum {
  /** 空闲 */
  leisure = 0,
  /** 使用中 */
  inUse = 1,
  /** 已作废 */
  abandoned = 2,
  /** 已调出 */
  calledout = 3,
}

export const ComputerUseStateEnumList = [
  { ID: ComputerUseStateEnum.leisure, Name: '空闲' },
  { ID: ComputerUseStateEnum.inUse, Name: '使用中' },
  { ID: ComputerUseStateEnum.abandoned, Name: '已作废' },
  { ID: ComputerUseStateEnum.calledout, Name: '已调出' },
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
}

export const EquipmentHistoryTypeEnumList = [
  { ID: EquipmentHistoryTypeEnum.create, Name: '创建' },
  { ID: EquipmentHistoryTypeEnum.update, Name: '修改' },
  { ID: EquipmentHistoryTypeEnum.abandon, Name: '作废' },
  { ID: EquipmentHistoryTypeEnum.callout, Name: '调出' },
  { ID: EquipmentHistoryTypeEnum.callin, Name: '调入' },
];
