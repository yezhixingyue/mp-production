/**
 * 外来物料到货状态枚举
 *
 * @export
 * @enum {number}
 */
export enum ExternalMaterialStatusEnum {
  /** 未到货 */
  WaitingDelivery = 0,
  /** 已入库 */
  HaveDelivery = 1,
  /** 已交接 */
  Received = 2,
  /** 已取消 */
  Canceled = 255,
}
