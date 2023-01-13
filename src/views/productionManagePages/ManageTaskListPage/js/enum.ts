/**
 * 生产任务列表 - 时长筛选枚举
 *
 * @export
 * @enum {number}
 */
export enum TaskListConditionCompareEnum {
  /** 实际时长大于预计时长 */
  timeout = 0,
  /** 实际时长小于预计时长 */
  timein = 1,
}
