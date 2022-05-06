export interface ILoginSubmitForm {
  Password: string
  Mobile: string
  Terminal: 1
}

export interface IUser {
  ID: string,
  Name: string,
  Account: {
    Token: string
  },
}
