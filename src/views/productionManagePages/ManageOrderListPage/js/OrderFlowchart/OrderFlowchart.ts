import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getNodeList } from './testList';
import { IOrderFlowchartDiaplayNode, IOrderFlowchartNode } from './types';

export const NodeWidth = 90; // 节点长
export const NodeHeight = 30; // 节点宽
export const LeftRightSpacing = 80; // 两个相邻节点左右间距
export const TopBottomSpacing = 90; // 两个相邻节点上下间距
export const PanelPadding = {
  left: 20,
  top: 45,
  right: 20,
  bottom: 20,
};

/**
 * 类 - 单个生产线订单流程图
 *
 * @export
 * @class OrderFlowchart
 */
export class OrderFlowchart {
  /** 各个工序节点组成的列表数据 */
  public NodeList: IOrderFlowchartNode[] = []

  /** 开始节点列表 */
  private StartNodes: IOrderFlowchartNode[] = []

  /** 结束节点  */
  private EndNode: IOrderFlowchartNode | undefined

  public DisplayList: IOrderFlowchartDiaplayNode[] = []

  public TotalWidth = 0

  public TotalHeight = 0

  public LineName = '封面'

  constructor() {
    // 数据整理或还原
    // 模拟列表数据
    const list = getNodeList();

    this.NodeList = list;

    this.StartNodes = list.filter(it => !it.SourceNodes || it.SourceNodes.length === 0);

    if (this.StartNodes.length === 0) return;

    const _EndNodeList = list.filter(it => !it.TargetNode);
    if (_EndNodeList.length === 1) {
      [this.EndNode] = _EndNodeList;
    } else if (_EndNodeList.length > 1) {
      MpMessage.error({ title: '渲染出错', msg: '结束节点出现多个' });
    } else {
      MpMessage.error({ title: '渲染出错', msg: '未找到流程结束节点' });
    }

    if (!this.EndNode) return;

    // 生成一个用于渲染展示的数据列表
    const displayList: IOrderFlowchartDiaplayNode[] = [];

    let minLeft = 0;
    let maxLeft = 0;
    let maxTop = 0;

    const handleNext = (Node: IOrderFlowchartDiaplayNode) => {
      if (Node.TargetNode) {
        const t = displayList.find(it => it.ID === Node.TargetNode);
        if (t) return; // 如果已存在于列表中则不再继续
        const NextNode = this.NodeList.find(_it => _it.ID === Node.TargetNode);
        if (NextNode) {
          const left = Node._Coordinate.left + NodeWidth + LeftRightSpacing;
          if (left > maxLeft) {
            maxLeft = left;
          }
          const _Coordinate = {
            left,
            top: Node._Coordinate.top + (NextNode.SourceNodes ? (NextNode.SourceNodes.length - 1) * (TopBottomSpacing / 2 + NodeHeight / 2) : 0),
          };

          const temp = {
            ...NextNode, _Coordinate, _NextNode: null, _Arrow: null,
          };

          const _Node = Node;
          _Node._NextNode = temp;

          displayList.push(temp);
          // 递归下去
          handleNext(temp);
        }
      }
    };

    const getBranchEndNode = (Node: IOrderFlowchartNode, list: IOrderFlowchartNode[]): null | IOrderFlowchartDiaplayNode => {
      if (!Node.TargetNode) return null;
      const next = this.NodeList.find(it => it.ID === Node.TargetNode);
      if (next) {
        const EndNode = displayList.find(it => it.ID === next.ID);
        if (EndNode) { // 如果下一个节点已存在于之前的列表中，则到此截至，该节点则是最终节点
          return EndNode;
        }
        list.push(next);
        return getBranchEndNode(next, list);
      }
      return null;
    };

    // 从开始节点为displayList填充信息（含坐标信息）
    this.StartNodes.forEach((it, i) => { // 该列表应进行下排序 把最长的（或最左边的）排在第一个 - 后续处理 - 或许也不用自动排列
      // 处理第一个（最左边的）
      if (i === 0) {
        const _Coordinate = { // 默认第一个开始节点的坐标为 0， 0
          left: 0,
          top: 0,
        };
        const temp = {
          ...it, _Coordinate, _NextNode: null, _Arrow: null,
        };
        displayList.push(temp);
        handleNext(temp);
      } else {
        // 1. 首先找到该分支连接到线上的节点 -- 形成一条分支线路
        const list: IOrderFlowchartNode[] = [it];
        const BranchEndNode = getBranchEndNode(it, list);
        if (!BranchEndNode || !BranchEndNode.SourceNodes) return;

        // 2. 获取当前线的top值（该分支线top值均相同）
        const joinedList = displayList.filter(_it => BranchEndNode.SourceNodes && BranchEndNode.SourceNodes.includes(_it.ID));
        if (joinedList.length === 0) return;
        const lastBranchNode = joinedList[joinedList.length - 1]; // 最后一个 即当前节点的上面位置的节点
        const top = lastBranchNode._Coordinate.top + NodeHeight + TopBottomSpacing;

        if (top > maxTop) {
          maxTop = top;
        }

        // 3. 获取到当前分支转换后的展示类型列表
        const branchDisplayList: IOrderFlowchartDiaplayNode[] = list.map((_it, _i) => {
          const left = BranchEndNode._Coordinate.left - (list.length - _i) * (NodeWidth + LeftRightSpacing);
          if (left < minLeft) {
            minLeft = left;
          }
          return {
            ..._it, _Coordinate: { left, top }, _NextNode: null, _Arrow: null,
          };
        });

        // 4. 附加NextNode信息
        branchDisplayList.forEach((node, nodeIndex) => {
          const _node = node;
          _node._NextNode = nodeIndex < branchDisplayList.length - 1 ? branchDisplayList[nodeIndex + 1] : BranchEndNode;
        });

        // 5. 加入到展示列表中
        displayList.push(...branchDisplayList);
      }
    });

    // 为displayList补充附加信息
    // 1. left值转为正数 或 0
    displayList.forEach(it => {
      const _it = it;
      const left = _it._Coordinate.left - minLeft;
      _it._Coordinate.left = left;
      if (left > maxLeft) maxLeft = left;
    });
    // 2. 附加箭头信息（箭头线的长度、rotate的角度） - 需要提前计算出来当前节点上箭头起点的坐标 及 到下一节点箭头中止的坐标，根据该信息生成所需数据
    displayList.forEach(it => {
      const _it = it;
      let arrow: IOrderFlowchartDiaplayNode['_Arrow'] = null;
      if (_it._NextNode) {
        arrow = {
          begin: {
            left: _it._Coordinate.left + NodeWidth,
            top: _it._Coordinate.top + NodeHeight / 2,
          },
          end: {
            left: _it._NextNode._Coordinate.left,
            top: _it._NextNode._Coordinate.top + NodeHeight / 2,
          },
          width: 0,
          rotate: 0,
        };
        if (arrow.end.top === arrow.begin.top) {
          arrow.width = arrow.end.left - arrow.begin.left;
        } else {
          const a = Math.abs(arrow.end.top - arrow.begin.top);
          const b = arrow.end.left - arrow.begin.left;

          // 箭头长度
          const width = Math.sqrt(a ** 2 + b ** 2);
          // 箭头旋转角度
          const rotate = Math.round((Math.acos(b / width) * 180) / Math.PI) * (arrow.end.top > arrow.begin.top ? 1 : -1);

          arrow.width = width;
          arrow.rotate = rotate;
        }
      }

      _it._Arrow = arrow;
    });

    this.DisplayList = displayList;
    this.TotalWidth = maxLeft + NodeWidth;
    this.TotalHeight = maxTop + NodeHeight + 50;
  }
}
