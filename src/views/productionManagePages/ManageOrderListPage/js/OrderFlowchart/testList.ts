import { FlowchartNodeStatusEnum } from './enum';
import { IOrderFlowchartNode } from './types';

/**
 * 获取模拟流程列表数据
 *
 * @returns
 */
export const getNodeList = () => {
  const temp1: IOrderFlowchartNode = {
    ID: '1',
    Name: '纸张出库',
    EquipmentGroupName: null,
    EquipmentName: null,
    Status: FlowchartNodeStatusEnum.completed,
    CompletionTime: '2023-01-03T14:56:58',
    Operator: null,
    SourceNodes: [],
    TargetNode: '2',
  };
  const temp2: IOrderFlowchartNode = {
    ID: '2',
    Name: '纸张分切',
    EquipmentGroupName: '裁刀',
    EquipmentName: '4号刀',
    Status: FlowchartNodeStatusEnum.completed,
    CompletionTime: '2023-01-03T14:56:58',
    Operator: '王小二',
    SourceNodes: ['1'],
    TargetNode: '3',
  };
  const temp3: IOrderFlowchartNode = {
    ID: '3',
    Name: '印刷',
    EquipmentGroupName: '印刷机',
    EquipmentName: '2号机',
    Status: FlowchartNodeStatusEnum.inProduction,
    CompletionTime: '',
    Operator: null,
    SourceNodes: ['2', '6'],
    TargetNode: '4',
  };
  const temp4: IOrderFlowchartNode = {
    ID: '4',
    Name: '覆膜',
    EquipmentGroupName: '覆膜机',
    EquipmentName: '1号',
    Status: FlowchartNodeStatusEnum.notStarted,
    CompletionTime: '',
    Operator: null,
    SourceNodes: ['3'],
    TargetNode: '5',
  };
  const temp5: IOrderFlowchartNode = {
    ID: '5',
    Name: '裁切',
    EquipmentGroupName: '裁刀',
    EquipmentName: '2号刀',
    Status: FlowchartNodeStatusEnum.notStarted,
    CompletionTime: '',
    Operator: null,
    SourceNodes: ['4'],
    TargetNode: null,
  };
  const temp6: IOrderFlowchartNode = {
    ID: '6',
    Name: '制作CTP',
    EquipmentGroupName: '制版机',
    EquipmentName: '1号机',
    Status: FlowchartNodeStatusEnum.completed,
    CompletionTime: '2023-01-03T14:56:58',
    Operator: '张大山',
    SourceNodes: [],
    TargetNode: '3',
  };

  return [temp6, temp1, temp2, temp3, temp4, temp5];
};
