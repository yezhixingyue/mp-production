/** 批量修改外协任务价格审核枚举 */
export enum TaskPriceCheckStatusEnum {
  /** 待修改 */
  Initial = 0,
  /** 待审核 */
  HaveChangePrice = 1,
  /** 未通过 */
  Refuse = 2,
  /** 待确认 */
  WaitCheck = 3,
  /** 已确认 */
  HaveChecked = 4
}

/** 批量修改外协任务价格审核枚举列表 */
export const TaskPriceCheckStatusEnumList = [
  { Name: '待修改', ID: TaskPriceCheckStatusEnum.Initial },
  { Name: '待审核', ID: TaskPriceCheckStatusEnum.HaveChangePrice },
  { Name: '未通过', ID: TaskPriceCheckStatusEnum.Refuse },
  { Name: '待确认', ID: TaskPriceCheckStatusEnum.WaitCheck },
  { Name: '已确认', ID: TaskPriceCheckStatusEnum.HaveChecked },
];

/** IsRefused 审核结果 财务确认 单选框组枚举 */
export enum RuleFormIsRefusedEnum {
  True = 0,
  False = 1,
  Other = 2,
}
