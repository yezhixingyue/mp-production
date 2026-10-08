/** 拼版分工列表条目接口类型 */
export interface IImpAllocationListItem {
  LineID: string

  MaterialID: string

  MaterialName: string

  MemberList: {
      ID: string
      Name: string
  }[]
}
