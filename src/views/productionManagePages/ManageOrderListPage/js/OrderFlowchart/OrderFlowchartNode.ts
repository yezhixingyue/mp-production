// import { IUser } from '@/store/modules/user/types';

// /**
//  * 工序节点状态 已完成 | 生产中 | 有问题
//  *
//  * @enum {number}
//  */
// enum OrderFlowchartNodeStatusEnum {
//   /** 已完成 */
//   completed = 0,
//   /** 生产中 */
//   inProduction = 1,
//   /** 有问题 */
//   atQuestion = 2,
// }

// /**
//  * 类 - 订单流程图中的一个工序节点
//  *
//  * @export
//  * @class OrderFlowchartNode
//  */
// export class OrderFlowchartNode {
//   /** 节点（工序）ID */
//   ID = ''

//   /** 节点（工序）名称 */
//   Name = ''

//   /** 设备组名称 */
//   EquipmentGroupName = ''

//   /** 设备名称 */
//   EquipmentName = ''

//   /** 节点（工序）状态 */
//   Status: OrderFlowchartNodeStatusEnum

//   /** 完成时间 */
//   CompletionTime: string | null = null

//   /** 完成人 */
//   Operator: IUser | null = null

//   /** 来源节点id列表 */
//   SourceNodes: (OrderFlowchartNode['ID'])[] = []

//   /** 下一节点id列表 */
//   TargetNodes: (OrderFlowchartNode['ID'])[] = []

//   constructor(data) {
//     this.Status = data.Status;
//   }
// }
