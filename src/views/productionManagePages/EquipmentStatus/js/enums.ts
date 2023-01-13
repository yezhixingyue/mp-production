import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';

/**
 * 机器状态枚举 -- 仅用于看板展示
 *
 * @export
 * @enum {number}
 */
export enum EquipmentStatusForBoardEnum {
  /** 已开机 */
  opened = 0,
  /** 生产中 */
  inWorking = 1,
  /** 已关闭 */
  closed = 2,
  /** 机器报停 */
  error = 3,
}

/**
 * 机器状态颜色枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentStatusColorEnum {
  /** 已开机 */
  opened = '#00FFFF',
  /** 生产中 */
  inWorking = '#95F204',
  /** 已关闭 */
  closed = '#D7D7D7',
  /** 机器报停 */
  error = '#D9001B',
}

/**
 * 机器状态Hover颜色枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentStatusHoverColorEnum {
  /** 已开机 */
  opened = 'rgb(0 190 255)',
  /** 生产中 */
  inWorking = 'rgb(4 242 7)',
  /** 已关闭 */
  closed = '#cbcbcb',
  /** 机器报停 */
  error = 'rgb(215 51 71)',
}

/**
 * 机器状态标题枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentStatusLabelEnum {
  /** 已开机 */
  opened = '已开机',
  /** 生产中 */
  inWorking = '生产中',
  /** 已关闭 */
  closed = '已关闭',
  /** 机器报停 */
  error = '机器报停',
}

/**
 * 任务状态枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentTaskStatusEnum {
  /** 生产中 */
  inWorking = ProductiveTaskStatusEnum.InProduction,
  /** 可生产 */
  canWorking = ProductiveTaskStatusEnum.Producibility,
  /** 等待物料 */
  needMaterial = ProductiveTaskStatusEnum.Initial,
  /** 异常 */
  error = ProductiveTaskStatusEnum.Error,
}

/**
 * 机器任务状态颜色枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentTaskStatusColorEnum {
  /** 生产中 */
  inWorking = '#70B603',
  /** 可生产 */
  canWorking = '#027DB4',
  /** 等待物料 */
  needMaterial = '#FFFF00',
  /** 异常 */
  error = '#D9001B',
}

/**
 * 机器任务状态Hover颜色枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentTaskStatusHoverColorEnum {
  /** 生产中 */
  inWorking = 'ForestGreen',
  /** 可生产 */
  canWorking = 'blue',
  /** 等待物料 */
  needMaterial = '#FFD700',
  /** 异常 */
  error = 'red',
}

/**
 * 机器任务状态标题枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentTaskStatusLabelEnum {
  /** 生产中 */
  inWorking = '生产中',
  /** 可生产 */
  canWorking = '可生产',
  /** 等待物料 */
  needMaterial = '等待物料',
  /** 异常 */
  error = '异常',
}
