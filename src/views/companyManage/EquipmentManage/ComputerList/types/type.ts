import { ComputerUseStateEnum, EquipmentHistoryTypeEnum } from './enum';

export interface IComputer {
  id: string
  index: number
  code: string
  displayNumber: number
  displayCode: string
  displayModel: string
  ip: string
  mac: string
  cpu: string
  memorySlotsNumber: number
  memory: string
  disk: string
  diskNumber: number
  graphicsCard: string
  networkCard: string
  os: string
  systermDiskType: string
  source: string
  purchaseAt: string
  warrantyExpiredAt: string
  state: ComputerUseStateEnum
  user: string | null
  creator: string
  createdAt: string
  updatedAt: string
}

export interface IRemarkSubmitParams {
  type: EquipmentHistoryTypeEnum;
  content: string;
  creator: string;
  equipmentId?: string; // 创建时不知道该id 需要服务器处理
}

/** 调入提交信息 */
export interface ICallinStateInfo {
  state: ComputerUseStateEnum
  user: string
}

export interface IComputerEditHistory {
  id: number;
  content: string;
  creator: string;
  createdAt: string
}
