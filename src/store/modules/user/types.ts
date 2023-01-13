export interface ILoginSubmitForm {
  Password: string
  Mobile: string
  Terminal: 1 | 2
  EquipmentID?: string
  Site?: 2
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
}
