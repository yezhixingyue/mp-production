/** 设备类型和设备组二级列表数据 */
export interface IEquipmentGroupLevelItem {
  ClassID: number
  ClassName: string
  EquipmentGroups: {
    GroupID: string
    GroupName: string
  }[]
}

/** 设备助手关联的设备组列表类型 */
export interface IAssistantRelationGroup {
  /** 助手类型 */
  TypeID: number
  /** 设备组ID */
  ID: string
  /** 设备组名称 */
  Name: string
  /** 分类ID */
  ClassID: number
  /** 分类名称 */
  ClassName: string
  /** 最小数量： 0 - 最大数量 */
  MinNumber: number
  /** 最大数量： 最小数量 - 100 */
  MaxNumber: number
}

/** 设备助手类型接口 */
export interface IAssistantType {
  ID: number
  Name: string
  NickName: string
  /** 显示顺序 0 - 255 */
  Index: number
  IsDisable: boolean
  /** 任(兼)职数 1 - 100 */
  Number: number
  CreateTime: string
  /** 关联的设备组列表 */
  GroupList: IAssistantRelationGroup[]
}

/** 设备助手 */
export interface IAssistantInfo {
  ID: string
  Name: string
  /** 身份证号 */
  IDCard: string
  /** 是否禁用 */
  IsDisable: boolean
  /** 操作人 */
  OperatorName: string
  /** 编辑时间 */
  EditTime: string
  /** 助手类型列表 */
  TypeList: IAssistantType['ID'][]
  CreateTime: string
}
