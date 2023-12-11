/**
 * 外协状态枚举值
 *
 * @export
 * @enum {number}
 */
export enum ExternalTaskStatusEnum {
  /** 待外协 */
  WaitFactoryReceive = 0,
  /** 已外协 */
  FactoryReceived = 10,
  /** 已出库 */
  HaveInstored = 30,
  /** 有问题 */
  Error = 40,
  /** 已入库 */
  HaveFinished = 50,
  /** 已交接 */
  Received = 60,
  /** 已取消 */
  Cancled = 255
}
