/** 块的详情信息 可用于补打块标签等 */
export interface IChunkDetail {
  OrderInfo: {
    CustomerName: string
    CustomerSN: string
    ProductName: string
    Content: string
    Number: number
    Unit: string
    KindCount: number
    ProduceEndTime: string
    /** 标签上方显示的编号 */
    StationSN: string
    /** 网点名称 StationName + DistrictSN 横杠链接 */
    StationName: string
    DistrictSN: string
    Size: string
  }
  /** 当前款数 */
  KindIndex: number
  WorkingList: { WorkingName: string }[]
}
