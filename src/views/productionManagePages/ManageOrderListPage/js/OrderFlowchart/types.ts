// import { IUser } from '@/store/modules/user/types';
import { FlowchartNodeStatusEnum } from './enum';

/**
 * 订单流程图中的一个工序节点的接口类型
 *
 * @export
 * @interface IOrderFlowchartNode
 */
export interface IOrderFlowchartNode {
  /** 节点（工序）ID */
  ID: string

  /** 节点（工序）名称 */
  Name: string

  /** 设备组名称 */
  EquipmentGroupName: string | null

  /** 设备名称 */
  EquipmentName: string | null

  /** 节点（工序）状态 */
  Status: FlowchartNodeStatusEnum

  /** 完成时间 */
  CompletionTime: string | null

  /** 完成人 */
  Operator: string | null

  /** 来源节点id列表 */
  SourceNodes: (IOrderFlowchartNode['ID'])[] | null

  /** 下一节点id */
  TargetNode: IOrderFlowchartNode['ID'] | null
}

export interface IOrderFlowchartDiaplayNode extends IOrderFlowchartNode {
  /** 该节点所处的坐标位置 */
  _Coordinate: {
    left: number
    top: number
  },
  /** 该节点的下一个节点信息 */
  _NextNode: null | IOrderFlowchartDiaplayNode
  _Arrow: null | {
    begin: {
      left: number
      top: number
    }
    end: {
      left: number
      top: number
    }
    width: number
    rotate: number
  }
}
