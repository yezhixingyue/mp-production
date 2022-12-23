import {
  EquipmentStatusColorEnum, EquipmentStatusEnum, EquipmentStatusHoverColorEnum,
  EquipmentStatusLabelEnum, EquipmentTaskStatusColorEnum, EquipmentTaskStatusEnum, EquipmentTaskStatusHoverColorEnum, EquipmentTaskStatusLabelEnum,
} from './enums';

/**
 * 设备状态枚举列表
 *
 * 已开机 生产中 已关机 机器报停
 */
export const EquipmentStatusEnumList = Object.keys(EquipmentStatusLabelEnum).map(key => ({
  ID: EquipmentStatusEnum[key],
  Name: EquipmentStatusLabelEnum[key],
  Color: EquipmentStatusColorEnum[key],
  HoverColor: EquipmentStatusHoverColorEnum[key],
}));

/**
 * 设备任务状态枚举列表
 *
 * 生产中 可生产 等待物料 异常
 */
export const EquipmentTaskStatusEnumList = Object.keys(EquipmentTaskStatusLabelEnum).map(key => ({
  ID: EquipmentTaskStatusEnum[key],
  Name: EquipmentTaskStatusLabelEnum[key],
  Color: EquipmentTaskStatusColorEnum[key],
  HoverColor: EquipmentTaskStatusHoverColorEnum[key],
}));
