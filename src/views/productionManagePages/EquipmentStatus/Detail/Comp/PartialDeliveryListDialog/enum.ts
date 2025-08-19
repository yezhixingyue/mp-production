export enum WorkingMaterialStatusEnum {
        /** 未拼版 */
        WaiteImposition = 0,
        /** 未送达 */
        WaiteReceive = 1,
        /** 已送达 */
        HaveReceived = 2,
}

export const WorkingMaterialStatusEnumList = [
  {
    ID: WorkingMaterialStatusEnum.WaiteImposition,
    Name: '未拼版',
  },
  {
    ID: WorkingMaterialStatusEnum.WaiteReceive,
    Name: '未送达',
  },
  {
    ID: WorkingMaterialStatusEnum.HaveReceived,
    Name: '已送达',
  },
];
