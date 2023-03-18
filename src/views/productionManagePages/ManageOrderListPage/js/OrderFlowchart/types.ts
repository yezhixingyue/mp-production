// import { IUser } from '@/store/modules/user/types';
import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { FlowchartNodeStatusEnum } from './enum';

/**
 * 订单流程图中的一个工序节点的接口类型
 *
 * @export
 * @interface IOrderFlowchartNode
 */
export interface IOrderFlowchartNode {
  /** 节点（任务）ID */
  TaskWorkingID: string

  /** 节点（工序）名称 */
  WorkingName: string

  /** 设备组名称 */
  // EquipmentGroupName: string | null

  // /** 设备名称 */
  // EquipmentName: string | null

  /** 设备信息 */
  Equipment?: IEquipmentBaseInfo

  /** 半成品 */
  SemiFinished?: IBaseProperty<string>

  /** 节点（工序）状态 */
  Status: FlowchartNodeStatusEnum

  /** 完成时间 */
  FinishTime: string | null

  /** 完成人 */
  Operator: string | null

  /** 来源节点id列表 */
  PreNodeList: (IOrderFlowchartNode['TaskWorkingID'])[] | null

  /** 下一节点id */
  // NextNode: IOrderFlowchartNode['TaskWorkingID'] | null

  /** 下一节点id列表 */
  NextNodeList: IOrderFlowchartNode['TaskWorkingID'][] | null

  /** 多结束节点时 使用到 用于自己多结束节点自身的原NextNode值 此时NextNode值会暂时变动 到最后还要还给NextNode */
  // _TempNextNode?: IOrderFlowchartNode['NextNode']
  // _TempNextNodeList?: IOrderFlowchartNode['NextNodeList']

  /** 是否是结束节点 */
  // _isEndNode?: boolean
}

export interface IOrderFlowchartDiaplayNode extends IOrderFlowchartNode {
  /** 该节点所处的坐标位置 */
  _Coordinate: {
    left: number
    top: number
    nextStartUseTop?: number
  },
  _ArrowList: {
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
  }[]
  /** 节点所在x索引位 */
  _XIndex: number
  /** 节点分支数量 用于计算y坐标数值 -- 后续删除该字段 */
  // _BranchAndPosition?: { x: number, y: number, BranchCount: number }
  /** 该节点的下一个节点信息 */
  // _NextNodes?: IOrderFlowchartDiaplayNode[]
  /** 该节点中指向外部的下一节点id列表 */
  _OutsideNextNodeIds?: string[]
}
