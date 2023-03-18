import { IOrderFlowchartDiaplayNode, IOrderFlowchartNode } from './types';

export const getArrowWidthRotate = (arrow: IOrderFlowchartDiaplayNode['_ArrowList'][number]) => {
  if (!arrow) return;

  const _arrow = arrow;

  if (arrow.end.top === arrow.begin.top) {
    _arrow.width = arrow.end.left - arrow.begin.left;
  } else {
    const a = Math.abs(arrow.end.top - arrow.begin.top);
    const b = arrow.end.left - arrow.begin.left;

    // 箭头长度
    const width = Math.sqrt(a ** 2 + b ** 2);

    // 箭头旋转角度
    const rotate = ((Math.acos(b / width) * 180) / Math.PI) * (arrow.end.top > arrow.begin.top ? 1 : -1);

    _arrow.width = width;
    _arrow.rotate = rotate;
  }
};

export const delay = (duration = 300) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, duration);
});

/** 判断一个节点是否为最开始节点 */
export const getIsOrNotTheStartNode = (it: IOrderFlowchartNode, list: IOrderFlowchartNode[]) => !it.PreNodeList || it.PreNodeList.length === 0
  || it.PreNodeList.filter(id => list.find(_it => _it.TaskWorkingID === id)).length === 0;

/** 判断一个节点是否为结束节点 */
export const getIsOrNotTheEndNode = (it: IOrderFlowchartNode, list: IOrderFlowchartNode[]) => !it.NextNodeList || it.NextNodeList.length === 0
  || it.NextNodeList.filter(id => list.find(_it => _it.TaskWorkingID === id)).length === 0;

/** 判断一个节点是否为结束节点 - 原 */
// export const getIsOrNotTheEndNode = (it: IOrderFlowchartNode, list: IOrderFlowchartNode[]) => !it.NextNode
// || !list.find(_it => _it.TaskWorkingID === it.NextNode);
