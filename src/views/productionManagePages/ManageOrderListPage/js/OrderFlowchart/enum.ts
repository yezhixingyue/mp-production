/**
 * 流程节点（工序）状态：  已完成 | 生产中 | 有问题
 *
 * @enum {number}
 */
export enum FlowchartNodeStatusEnum {
  /** 已完成 */
  completed = 0,
  /** 生产中 */
  inProduction = 1,
  /** 未开始 */
  notStarted = 2,
  /** 有问题 */
  atQuestion = 255,
}
