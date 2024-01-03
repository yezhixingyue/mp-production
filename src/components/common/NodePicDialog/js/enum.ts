/**
 * 流程节点（工序）状态：  已完成 | 生产中 | 有问题
 *
 * @enum {number}
 */
export enum FlowchartNodeStatusEnum {
  /** 已完成 */
  completed = 2,
  /** 生产中 */
  inProduction = 1,
  /** 未开始 */
  notStarted = 0,
  /** 有问题 */
  atQuestion = 3,
  /** 已终止 */
  stop = 255,
}

export enum FlowchartNodeColorEnum {
  /** 已完成 */
  completed = '#4B7902',
  /** 生产中 */
  inProduction = '#00BFBF',
  /** 有问题 */
  atQuestion = '#A30014',
  /** 已终止 */
  stop = '#cbcbcb',
}
