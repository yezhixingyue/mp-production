/**
 * 外协入库报工结果码枚举值
 *
 * @export
 * @enum {number}
 */
export enum ExternalReportResultCodeEnum {
    /** 第一次扫描 */
    Success,
    /** 重复扫描 */
    Repeated,
    /** 重复扫码已上报问题 */
    HaveException
}
