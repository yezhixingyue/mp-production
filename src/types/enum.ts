/** 任务列表使用模块枚举 */
export enum TaskListUseModuleEnum {
  /** 生产任务 */
  ProductiveTask = 0,
  /** 设备状态 */
  EquipmentStatus = 1,
}

/** 获取任务列表数据排序枚举 */
export enum TaskOrderType {
    /** 创建时间正序 */
    CreateTimeAsc = 0,
    /** 创建时间倒序 */
    CreateTimeDesc = 1,
    /** 状态倒序 */
    StatusDesc = 2,
    /** 完工时间正序 */
    FinishTimeAsc = 3,
    /** 加工顺序 */
    Process = 4,
    /** 资源第一次送达 */
    FirstReceive = 5,
}
