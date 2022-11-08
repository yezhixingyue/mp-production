import { EducationEnum, SexEnum, StaffStatusEnum } from './enums';

/**
 * 员工列表部门岗位接口
 *
 * @export
 * @interface IStaffPosition
 */
export interface IStaffPosition {
  First: {
    FirstDepartmentID: number
    SecondDepartmentID: number
    ThirdDepartmentID: number
  },
  Second: {
    PositionID: string
    PositionName: string
  },
}

export interface IStaff {
  StaffID: string
  StaffName: string
  Sex: SexEnum
  /** 审核状态 */
  Status: StaffStatusEnum
  Mobile: string
  Password: string
  /** 学历 */
  Education: EducationEnum
  /** 身份证 */
  IDCard: string
  /** 省市 */
  Area: {
    RegionalID: number
    CityID: number
  }
  /** 详细地址 */
  DetailAddress: string
  /** 头像 */
  HeadPic: string
  /** 审核人 */
  CheckUser: null | {
    StaffID: string
    StaffName: string
  }
  /** 部门岗位 */
  PositionList: IStaffPosition[]
  /** 注册、入职、生日、审核等时间 */
  TimeRecord: {
    CheckTime: null | string
    RegTime: string
    Birthday: string // 根据IDCard生成
    /** 入职时间 */
    JoinDate: string
    /** 离职时间 */
    OutTime: null | string
  }
  /** 最后一次登录记录 */
  LastLoginRecord: null | {
    /** 时间 */
    First: string
    /** IP地址 */
    Second: string
  }
  /** 是否仅使用内部网络 */
  UseIntranet: boolean
}
