/** 订单审核状态枚举 */
export enum PDOStatusEnum {
  /** 已下单 */
  create = 0,
  /** 待审核 */
  haveDownload = 1,
  /** 审核中 */
  pending = 2,
  /** 已审核 */
  finish = 3,
  /** 已取消 */
  cancelled = 255,
}

/** 订单审核状态枚举列表 */
export const PDOStatusEnumList = [
  { ID: PDOStatusEnum.create, Name: '已下单' },
  { ID: PDOStatusEnum.haveDownload, Name: '待审核' },
  { ID: PDOStatusEnum.pending, Name: '审核中' },
  { ID: PDOStatusEnum.finish, Name: '已审核' },
  { ID: PDOStatusEnum.cancelled, Name: '已取消', className: 'is-gray' },
];

/** 折手位置枚举  用于装订边、掀口 */
export enum SignaturePositionEnum {
  /** 无 */
  None = 0,
  /** 左 */
  Left = 1,
  /** 上 */
  Top = 2,
  /** 右 */
  Right = 3,
  /** 下 */
  Bottom = 4,
}

/** 折手位置枚举列表  用于装订边、掀口 */
export const SignaturePositionEnumList = [
  { ID: SignaturePositionEnum.None, Name: '无' },
  { ID: SignaturePositionEnum.Left, Name: '左' },
  { ID: SignaturePositionEnum.Right, Name: '右' },
  { ID: SignaturePositionEnum.Top, Name: '上' },
  { ID: SignaturePositionEnum.Bottom, Name: '下' },
];

export enum CraftSolveStepEnum {
  /** 不做工艺分解 */
  NoneCraftSolve = 0,
  /** 创建审核信息 */
  CreateCraftSolve = 1,
  /** 保存分解信息 */
  Save = 2,
  /** 上传文件 */
  UploadFile = 3,
  /** 提交审核 */
  Submit = 4,
}
