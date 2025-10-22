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
  /** 生产中 */
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

export enum ExternalTaskDateTypeRadioEnum {
  Create = 'Create',
  ExpectedFinish = 'ExpectedFinish',
  /** 外协入库时间 */
  FinishTime = 'FinishTime',
}
