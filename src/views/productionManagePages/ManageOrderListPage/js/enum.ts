/** 订单状态枚举 */
export enum OrderStatus {
  /** 创建生产订单 */
  CreateOrder = 0,
  /** 文件已同步 */
  ConvertFile = 2,
  /** 待折手 */
  WaitFolding = 10,
  /** 已做折手 */
  HaveFolding = 15,
  /** 已排程 */
  HaveScheduling = 20,
  /** 生产中 */
  InProduction = 30,
  /** 已完成 */
  Finished = 50,
  /** 已取消 */
  HaveCancled = 255
}

/** 订单是否可以取消枚举 */
export enum OrderCancelStatus {
  /** 可以直接取消（未拼版） */
  candirect = 0,
  /** 可取消，但需要询问及选择大版（已拼版） */
  needplate = 1,
  /** 不可取消 */
  cannot = 2,
}

/** 订单状态枚举列表 */
export const OrderStatusList = [
  {
    ID: OrderStatus.CreateOrder,
    Name: '创建生产订单',
    _CancelStatus: OrderCancelStatus.candirect, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.ConvertFile,
    Name: '文件已同步',
    _CancelStatus: OrderCancelStatus.candirect, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.WaitFolding,
    Name: '待折手',
    _CancelStatus: OrderCancelStatus.candirect, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.HaveFolding,
    Name: '已折手',
    _CancelStatus: OrderCancelStatus.candirect, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.HaveScheduling,
    Name: '已排程',
    _CancelStatus: OrderCancelStatus.candirect, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.InProduction,
    Name: '生产中',
    _CancelStatus: OrderCancelStatus.needplate, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.Finished,
    Name: '已完成',
    _CancelStatus: OrderCancelStatus.cannot, // 该状态是否可以取消
  },
  {
    ID: OrderStatus.HaveCancled,
    Name: '已取消',
    _CancelStatus: OrderCancelStatus.cannot, // 该状态是否可以取消
  },
];
