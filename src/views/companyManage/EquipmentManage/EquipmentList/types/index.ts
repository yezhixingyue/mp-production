import { EquipmentHistoryTypeEnum, EquipmentStatusEnum, EquipmentTypeEnum } from './enum';

/** 设备接口类型（父类） */
interface IEquipmentBasic {
  id: string
  /** 标签编号 */
  code: string
  /** 设备类型 */
  type: EquipmentTypeEnum
  /** 设备型号 */
  model: string
  /** 设备状态 */
  status: EquipmentStatusEnum
  /** 供应商 */
  supplier: string | null
  /** 采购时间 */
  purchaseAt: string | null
  /** 保修到期时间 */
  warrantyExpiredAt: string | null
  /** 使用人 */
  user: string | null
  /** 创建人 */
  creator: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 备注 */
  remark: string
}

/** 电脑主机类型 */
export interface IComputer extends IEquipmentBasic {
  attribute: {
    ip: string
    mac: string
    cpu: string
    memorySlotsNumber: number
    memory: string
    diskNumber: number
    disk: string
    /** 显卡 */
    graphicsCard: string
    /** 网卡 */
    networkCard: string
    os: string
    systermDiskType: string
  }
}

/** 显示器 */
export interface IDisplayer extends IEquipmentBasic {
  /** 显示器属性 后续需要可扩充 */
  attribute: {
    /** 设备型号 */
    model: string
  }
}

/** 电脑主机 | 显示器等设备组合类型 */
export type TEquipment = IComputer | IDisplayer;

export interface IAttrFormClass {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getParams: () => any
}

export interface IRemarkSubmitParams {
  type: EquipmentHistoryTypeEnum;
  content: string;
  creator: string;
  equipmentId?: string;
}

/** 调入提交信息 */
export interface ICallinStateInfo {
  status: EquipmentStatusEnum
  user: string
}

export interface IEquipmentHistory {
  id: number;
  content: string;
  creator: string;
  createdAt: string
}
