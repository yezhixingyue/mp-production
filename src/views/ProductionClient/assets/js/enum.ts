import { getEnumList } from '@/assets/js/utils/getListByEnums';

/**
 * 加工设备任务状态枚举类型
 *
 * @export
 * @enum {number}
 */
export enum ProductiveTaskStatusEnum {
  /** 未送达 */
  Initial = 0,
  /** 可生产 */
  Producibility = 10,
  /** 生产中 */
  InProduction = 30,
  /** 有问题 */
  Error = 40,
  /** 已生产 */
  Finished = 50,
  // /** 已送达 */
  // HaveArrived = 55,
  /** 已取消 */
  HaveCancled = 255,
}

const ProductiveTaskStatusEnumObj = {
  Initial: {
    ID: ProductiveTaskStatusEnum.Initial,
    Name: '未送达',
  },
  Producibility: {
    ID: ProductiveTaskStatusEnum.Producibility,
    Name: '可生产',
  },
  InProduction: {
    ID: ProductiveTaskStatusEnum.InProduction,
    Name: '生产中',
  },
  Error: {
    ID: ProductiveTaskStatusEnum.Error,
    Name: '有问题',
  },
  Finished: {
    ID: ProductiveTaskStatusEnum.Finished,
    Name: '已生产',
  },
  HaveCancled: {
    ID: ProductiveTaskStatusEnum.HaveCancled,
    Name: '已取消',
  },
};

export const ProductiveTaskStatusEnumList = getEnumList(ProductiveTaskStatusEnumObj);

/**
 * 报工模块扫描条码送达结果响应码枚举
 *
 * @export
 * @enum {number}
 */
export enum EquipmentReceiveCodeEnum {
  /** 成功送达 */
  OK = 0,
  /** 已送达，是当前加工任务 */
  CurrentTask = 1,
  /** 非前加工任务 */
  UnCurrentTask = 2,
  /** 位置错误 */
  ErrorPosition = 3,
  /** 订单已取消 */
  HaveCancled = 4,
  /** 待确认 */
  NeedConfirm = 5,
}
