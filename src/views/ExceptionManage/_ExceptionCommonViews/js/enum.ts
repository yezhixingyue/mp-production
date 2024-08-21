/**
 * 异常处理状态枚举
 *
 * @export
 * @enum {number}
 */
export enum ExceptionHandlerStatusEnum {
  /** 未处理 */
  unprocessed = 0,
  /** 已处理 */
  processed = 200,
  /** 已取消 */
  canceled = 255,
}
