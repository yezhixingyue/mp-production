export interface IOrderPackageList {
  ID: number,
  ServerID: number,
  OrderID: string,
  Status: number,
  Number: number,
  TotalAmount: number,
  PaidAmount: number,
  PaidCashAmount: number,
  PaidBeanNumber: number,
  UnpaidAmount: number,
  Weight: number,
  CreateTime: string
}
export interface IGetOrderInfo {
    ID: string,
    OrderCode: string,
    ServerName: string,
    FirstLevel: string,
    SecondLevel: string,
    ProductName: string,
    Content: string,
    KindCount: number,
    Number: number,
    Unit: string,
    Size: string,
    Materials: string[],
    Requests: string[],
    Files: string[],
    FinishNumber: number,
    PrintInfo: {
      Type: number,
      PackageNumber: number,
      PrintNumber: number,
      Packages: IOrderPackageList[]
    } | null,
    CreateTime: string
}
export interface IPrintResponse {
  ID: number,
  ServerID: number,
  OrderID: string,
  Status: number,
  Number: number,
  TotalAmount: number,
  PaidAmount: number,
  PaidCashAmount: number,
  PaidBeanNumber: number,
  UnpaidAmount: number,
  Weight: number,
  CreateTime: string
}
