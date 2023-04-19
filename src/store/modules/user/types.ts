export interface ILoginSubmitForm {
  Password: string
  Mobile: string
  /** 0. 客户端   1. 网页 */
  Terminal: 1 | 2
  EquipmentID?: string
  /** 1. 后台 2. 报工 3. 下单和外协回货  */
  Site: 1 | 2 | 3
}

export interface IUser {
  StaffID: string,
  StaffName: string,
  Account: {
    Token: string
  },
  Token: string,
  PermissionList: object
  Mobile: string
  HeadPic: string
}
