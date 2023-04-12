import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IOrderFlowchartDiaplayNode, IOrderFlowchartNode } from './types';
import { getArrowWidthRotate, getIsOrNotTheEndNode, getIsOrNotTheStartNode } from './utils';

export const NodeWidth = 100; // 节点长
export const NodeHeight = 30; // 节点宽
export const LeftRightSpacing = 80; // 两个相邻节点左右间距
export const TopBottomSpacing = 90; // 两个相邻节点上下间距
export const PanelPadding = {
  left: 20,
  top: 45,
  right: 20,
  bottom: 20,
};

const ArrowOffsetXDistance = {
  left: 5,
  right: 4,
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

  /** 下一节点指向外部的节点列表  */
  public NextOutsideNodes: IOrderFlowchartDiaplayNode[] = []

  public DisplayList: IOrderFlowchartDiaplayNode[] = []

  public TotalWidth = 0

  public TotalHeight = 0

  public LineName = ''

  constructor(list: IOrderFlowchartNode[] = []) {
    // 数据整理或还原
    this.NodeList = list;

    // 全部节点id
    const allValidNodeIds = list.map(it => it.TaskWorkingID);

    if (list.length > 0) this.LineName = list[0].SemiFinished?.Name || '';

    this.StartNodes = list.filter(it => getIsOrNotTheStartNode(it, list));

    if (this.StartNodes.length === 0) {
      MpMessage.error({ title: '渲染出错', msg: '未找到流程开始节点' });
      return;
    }

    const _EndNodeList = list.filter(it => getIsOrNotTheEndNode(it, list));
    if (_EndNodeList.length === 0) {
      MpMessage.error({ title: '渲染出错', msg: '未找到流程结束节点' });
      return;
    }

    /**
     * 思路：1. 生成一个金字塔类型的数据结构 Pyramid
     *
     * 金字塔的第一层（从下往上）由所有的结束节点组成
     */

    const PyramidDatas = [_EndNodeList];

    let i = 0;
    let maxLevelNumber = PyramidDatas[i].length;
    let maxHeightIndex = 0;
    while (i < PyramidDatas.length) {
      const nodes = PyramidDatas[i];
      const curLevelNodes: IOrderFlowchartNode[] = [];

      nodes.forEach(node => { // 找到其所有的上级节点并加入到list里面
        if (node.PreNodeList && node.PreNodeList.length > 0) {
          node.PreNodeList.forEach(preId => {
            const prev = list.find(it => it.TaskWorkingID === preId);
            if (prev && prev.NextNodeList) {
              // 全部已加入的节点id列表
              const joinedIds = [...PyramidDatas.reduce((a, b) => [...a, ...b], []).map(a => a.TaskWorkingID), ...curLevelNodes.map(a => a.TaskWorkingID)];
              const t = prev.NextNodeList.find(id => !joinedIds.includes(id) && allValidNodeIds.includes(id));
              // 如果该节点的下级节点有多个且其它下级节点不在金字塔结构和list中并且存在于整个列表数据中则暂不加入，等待后续重新遍历到，此处且去重
              if (!t && !joinedIds.includes(prev.TaskWorkingID)) {
                curLevelNodes.push(prev);
              }
            }
          });
        }
      });

      if (curLevelNodes.length > 0) {
        PyramidDatas.push(curLevelNodes);
        if (curLevelNodes.length > maxLevelNumber) {
          maxLevelNumber = curLevelNodes.length;
          maxHeightIndex = i + 1;
        }
      }

      i += 1;
    }

    /**
     * 2. 获取该流程图的宽和高
     */

    this.TotalWidth = PyramidDatas.length * NodeWidth + (PyramidDatas.length - 1) * LeftRightSpacing;
    this.TotalHeight = maxLevelNumber * NodeHeight + (maxLevelNumber - 1) * TopBottomSpacing + 50;

    /**
     * 3. 添加定位信息 PyramidDatas 并填充_PositionHandleNodeDisplayList列表
     */

    const _PositionHandleNodeDisplayList: IOrderFlowchartDiaplayNode[] = [];

    const createDisplayItem = (node: IOrderFlowchartNode, left: number, top: number, _XIndex: number) => { // 创建一个带有坐标信息的节点
      const _node = {
        ...node,
        _Coordinate: {
          left,
          top,
        },
        _ArrowList: [],
        _XIndex,
      };
      return _node;
    };

    PyramidDatas[maxHeightIndex].forEach((node, index) => { // 获取已确定的位置信息
      const _node = createDisplayItem(
        node,
        (PyramidDatas.length - maxHeightIndex - 1) * (NodeWidth + LeftRightSpacing), // left
        index * (NodeHeight + TopBottomSpacing), // top
        maxHeightIndex, // _XIndex  x层级坐标
      );
      _PositionHandleNodeDisplayList.push(_node);
    });

    const bianliPush = (lastIndex: number, toLeft = true) => { // 遍历添加其它层的节点信息
      if ((lastIndex <= 0 && !toLeft) || (toLeft && lastIndex >= PyramidDatas.length - 1)) return; // 到达边界

      const prevNodes = _PositionHandleNodeDisplayList.filter(n => n._XIndex === lastIndex); // 上一层节点（已确定坐标）
      if (prevNodes.length === 0) return;

      const rowIndex = lastIndex + (toLeft ? 1 : -1);
      const key = toLeft ? 'NextNodeList' : 'PreNodeList';

      const nodes = PyramidDatas[rowIndex]; // 当前层的所有节点
      const pipeList: IOrderFlowchartDiaplayNode[] = []; // 管道

      const left = (PyramidDatas.length - rowIndex - 1) * (NodeWidth + LeftRightSpacing);

      const unrestList: IOrderFlowchartNode[] = [];

      nodes.forEach(n => { // pipeList注入节点
        if (n[key] && (n[key] as []).length > 0) {
          const validNextNodes = prevNodes.filter(it => n[key]?.includes(it.TaskWorkingID));

          const tops = validNextNodes.map(it => it._Coordinate.top);

          if (tops.length > 0) {
            const top = tops.length === 1 ? tops[0] : ((Math.max(...tops) - Math.min(...tops)) / 2 + Math.min(...tops));
            pipeList.push(createDisplayItem(n, left, top, rowIndex));
          } else {
            unrestList.push(n);
          }
        } else {
          unrestList.push(n);
        }
      });

      if (pipeList.length > 1) { // 去除重合区间
        // 高度排序 从上到下（从小到大）
        pipeList.sort((a, b) => a._Coordinate.top - b._Coordinate.top);
        pipeList.forEach((p, pIndex) => {
          const next = pipeList[pIndex + 1];
          if (next) { // 存在下一个节点
            const distance = p._Coordinate.top - next._Coordinate.top;
            const diff = (NodeHeight + TopBottomSpacing) - Math.abs(distance);
            if (diff > 0) { // 如果小于最小距离 -- 此时需要调整上下距离
              // 1. 在上方的向上平移
              let _continue = true;
              const _topList = pipeList.slice(0, pIndex + 1).reverse();
              _topList.forEach((_it, _i) => {
                if (!_continue) return;
                if (_i > 0 && _topList[_i - 1]._Coordinate.top - _it._Coordinate.top >= NodeHeight + TopBottomSpacing) { // 如果距离足够则不再变化
                  _continue = false;
                  return;
                }
                const _t = _it;
                _t._Coordinate.top -= diff / 2;
              });

              // 2. 在下方的向下平移
              _continue = true;
              const _bottomList = pipeList.slice(pIndex + 1);
              _bottomList.forEach((_it, _i) => {
                if (!_continue) return;
                if (_i > 0 && _it._Coordinate.top - _bottomList[_i - 1]._Coordinate.top >= NodeHeight + TopBottomSpacing) { // 如果距离足够则不再变化
                  _continue = false;
                  return;
                }
                const _t = _it;
                _t._Coordinate.top += diff / 2;
              });
            }
          }
        });

        const start = pipeList[0];
        // const end = pipeList[pipeList.length - 1];

        // if (end._Coordinate.top > (this.TotalHeight - 50 - NodeHeight)) { // 最后一个节点高度超出了最大高度
        //   const diff = end._Coordinate.top - (this.TotalHeight - 50 - NodeHeight);
        //   pipeList.forEach(_it => {
        //     const _t = _it;
        //     _t._Coordinate.top -= diff;
        //   });
        // }
        if (start._Coordinate.top < 0) { // 最开始节点高度高于0
          const diff = start._Coordinate.top;
          pipeList.forEach(_it => {
            const _t = _it;
            _t._Coordinate.top -= diff;
          });
        }

        const end = pipeList[pipeList.length - 1];

        if (end._Coordinate.top > (this.TotalHeight - 50 - NodeHeight)) { // 最后一个节点高度超出了最大高度
          this.TotalHeight = end._Coordinate.top + NodeHeight + 50;
        }
      }

      unrestList.forEach((n, i) => {
        const top = i === 0 ? this.TotalHeight - 50 + TopBottomSpacing : pipeList[pipeList.length - 1]._Coordinate.top + NodeHeight + TopBottomSpacing;
        pipeList.push(createDisplayItem(n, left, top, rowIndex));
        if (top + NodeHeight + 50 > this.TotalHeight) this.TotalHeight = top + NodeHeight + 50;
      });

      if (pipeList.length > 0) _PositionHandleNodeDisplayList.push(...pipeList);

      bianliPush(rowIndex, toLeft);
    };

    bianliPush(maxHeightIndex); // 向左
    bianliPush(maxHeightIndex, false); // 向右

    /**
     * 4. 设置箭头信息 已知_PositionHandleNodeDisplayList
     */

    _PositionHandleNodeDisplayList.forEach((it) => {
      const _it = it;
      let arrowList: IOrderFlowchartDiaplayNode['_ArrowList'] = [];
      // const nextNodes = _PositionHandleNodeDisplayList.filter(n => n._XIndex === _it._XIndex - 1);
      const validNextNodes = _PositionHandleNodeDisplayList.filter(v => it.NextNodeList?.includes(v.TaskWorkingID));
      if (validNextNodes.length > 0) {
        arrowList = validNextNodes.map(node => ({
          begin: {
            left: _it._Coordinate.left + NodeWidth + ArrowOffsetXDistance.left,
            top: _it._Coordinate.top + NodeHeight / 2,
          },
          end: {
            left: node._Coordinate.left - ArrowOffsetXDistance.right,
            top: node._Coordinate.top + NodeHeight / 2,
          },
          width: 0,
          rotate: 0,
        }));
        arrowList.forEach(arrow => {
          getArrowWidthRotate(arrow);
        });
      }

      _it._ArrowList = arrowList;
    });

    /**
     * 5. 找出所有指向外部的节点 用于连接组合生产线
     */

    this.NextOutsideNodes = _PositionHandleNodeDisplayList.filter(node => {
      if (node.NextNodeList && node.NextNodeList.length > 0) {
        const _ids = node.NextNodeList.filter(id => !allValidNodeIds.includes(id));
        if (_ids.length > 0) {
          const _node = node;
          _node._OutsideNextNodeIds = _ids;
          return true;
        }
      }
      return false;
    });

    /**
     * 6. 数据处理完成 -- 进行赋值
     */

    this.DisplayList = _PositionHandleNodeDisplayList;
  }

  /** 半成品指向组合工序 -- 上一级类调用该方法 */
  setEndNodeArrow(setEndNodeArrowInstance: { distanceX: number, distanceY: number }, EndNodeTaskWorkingID: string) {
    if (this.DisplayList.length > 0) {
      const EndNode = this.DisplayList.find(it => it.TaskWorkingID === EndNodeTaskWorkingID);
      if (!EndNode) return;
      const arrow: IOrderFlowchartDiaplayNode['_ArrowList'][number] = {
        begin: {
          left: EndNode._Coordinate.left + NodeWidth + ArrowOffsetXDistance.left,
          top: EndNode._Coordinate.top + NodeHeight / 2,
        },
        end: {
          left: EndNode._Coordinate.left + NodeWidth + setEndNodeArrowInstance.distanceX - ArrowOffsetXDistance.right,
          top: EndNode._Coordinate.top + NodeHeight / 2 + setEndNodeArrowInstance.distanceY,
        },
        width: 0,
        rotate: 0,
      };

      getArrowWidthRotate(arrow);

      EndNode._ArrowList.push(arrow);
    }
  }
}
