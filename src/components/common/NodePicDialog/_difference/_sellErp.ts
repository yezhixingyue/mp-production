// // 生产专用

// import api from '@/api';
// import { IBaseProperty } from '@/assets/types';
// import { CommonDialogComp as DialogContainerComp } from '@/components/common/mpzj-sell-lib/lib';
// import _getEnumList from '@/assets/js/utils/getEnumList';

// /** 标记当前系统为哪个，以方便在组件中进行差异性的处理。暂定值类型： factory：工厂，_sellErp：销售Erp，orderPc：官网下单 */
// export const nodePicPlatform: 'factory' | '_sellErp' | 'orderPc' = 'factory';

// export { DialogContainerComp }; // 弹窗组件

// export const getProcessListApi = api.getOrderProduceProcess; // 接口地址

// export { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/filters';

// /* 报工方式枚举相关
// -------------------------------------- */
// export enum ReportModeEnum {
//   /** 块报工 */
//   block = 0,
//   /** 大版报工 */
//   board = 1,
//   /** 订单报工 */
//   order = 2,
// }

// interface _IManagePlateCommonInfo {
//   ID: string
//   /** 大版编号 */
//   Code: number
//   /** 模板 */
//   Template: string
//   /** 模板尺寸 */
//   TemplateSize: string
//   /** 物料 */
//   Material: string
//   /** 印刷数量 */
//   Number: number
//   /** 单位 */
//   Unit: string
//   /** 包含块数量  */
//   ChunkNumber: number
//   /** 拼版时间 */
//   CreateTime: string
//   /** 操作人 */
//   Operator: string
//   /** 生产线 */
//   Line: string
//   /** 当前位置 */
//   // Equipment: IEquipmentBaseInfo
//   Position: string
//   /** 状态 */
//   Status: number
//   /** 条码稿 */
//   MapFilePath: string
//   /** 大版序号 */
//   Index: string
// }

// type IPlateListChild = _IManagePlateCommonInfo

// interface IManagePlateInfo extends _IManagePlateCommonInfo {
//   /** 子板列表 */
//   ChildList: IPlateListChild[]
// }

// interface ISellOrderLineItem {
//   /** 生产线ID */
//   ID: string
//   /** 生产线名称 */
//   Name: string
//   /** 大版列表 */
//   PlateList: number[]
// }

// interface ISellOrderInstanceItem {
//   /** 半成品名称 */
//   SemiFinishedName: string
//   /** 物料 */
//   Material: string
//   /** 尺寸 */
//   Size: string
//   /** 数量 */
//   Number: number
//   /** 单位 */
//   Unit: string
//   /** 生产线列表 */
//   LineList: ISellOrderLineItem[]
// }

// interface IManageOrderListItem {
//   /** 订单ID */
//   ID: string
//   /** 销售服务器名称 */
//   ServerName: string
//   /** 订单编号 */
//   OrderCode: string
//   /** 分类一级 */
//   FirstLevel: string
//   /** 分类二级 */
//   SecondLevel: string
//   /** 产品名称 */
//   ProductName: string
//   /** 内容 */
//   Content: string
//   /** 款数 */
//   KindCount: number
//   /** 数量 */
//   Number: number
//   /** 单位 */
//   Unit: string
//   /** 尺寸 */
//   Size: string
//   /** 下单时间 */
//   CreateTime: string
//   /** 预计完成时间 */
//   WishFinishTime: string
//   /** 是否已置顶 */
//   IsTop: boolean
//   /** 生产线 */
//   Line: string
//   /** 实例列表 */
//   InstanceList: ISellOrderInstanceItem[]
// }

// interface IManageChunkInfo {
//   /** ID */
//   ID: string
//   /** 块ID */
//   ChunkID: string
//   /** 块编号 */
//   ChunkCode: string
//   /** 大版编号 */
//   PlateCode: number
//   /** 销售端名称 */
//   ServerName: string
//   /** 物料 */
//   Material: string
//   /** 尺寸规格 */
//   Size: string
//   /** 数量 */
//   Number: number
//   /** 单位 */
//   Unit: string
//   /** 生产线 */
//   Line: string
//   /** 当前所在机器位置  */
//   // Equipment?: IEquipmentBaseInfo
//   /** 当前位置 */
//   Position: string
//   /** 状态 */
//   Status: number
//   /** 缩略图 前面 */
//   FrontThumbil: string
//   /** 缩略图 后面 */
//   BackThumbil: string
// }

// interface IEquipmentBaseInfo {
//   /** 设备ID */
//   ID: string
//   /** 设备名称 */
//   Name: string
//   /** 设备组分类ID */
//   ClassID: number
//   /** 设备组分类名称 */
//   ClassName: string
//   /** 设备组ID */
//   GroupID: string
//   /** 设备组名称 */
//   GroupName: string
//   /** 是否外协工厂 */
//   IsExternalFactory: boolean
// }

// export const getEnumList = (e) => _getEnumList(e, true);

// export type INodePicPlateListChild = IPlateListChild;
// export type INodePicManagePlateInfo = IManagePlateInfo;
// export type INodePicManageOrderListItem = IManageOrderListItem;
// export type INodePicManageChunkInfo = IManageChunkInfo;
// export type INodePicBaseProperty<T> = IBaseProperty<T>;
// export type INodePicEquipmentBaseInfo = IEquipmentBaseInfo;
