/** 组合工序任务资源列表 - 资源项目 - 状态枚举 */
export enum UnionTaskResourceStatusEnum {
  /** 未报工 */
  UnReport=0,
  /** 已报工 */
  HaveReport = 1,
  /** 已送达 */
  HaveReceived = 2,
}

/** 组合工序任务资源状态枚举列表 */
// export const UnionTaskResourceStatusEnumList = [
//   { ID: UnionTaskResourceStatusEnum.UnReport, Name: '未报工' },
//   { ID: UnionTaskResourceStatusEnum.HaveReport, Name: '已报工' },
//   { ID: UnionTaskResourceStatusEnum.HaveReceived, Name: '已送达' },
// ];
