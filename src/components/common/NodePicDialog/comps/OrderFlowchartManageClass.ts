import { nextTick } from 'vue';
import { OrderFlowchart } from '../js/OrderFlowchart';
import { IOrderFlowchartNode } from '../js/types';
import { ReportModeEnum, getProcessListApi } from '../_difference';

/**
 * 流程图数据 - 内部处理半成品列表（大版、块）和组合工序列表
 *
 * @export
 * @class OrderFlowchartManageClass
 */
export class OrderFlowchartManageClass {
  /** 单个生产线、块、大版流程实例列表 */
  LineFlowchartList: OrderFlowchart[] = []

  /** 组合工序数据 -- 为单独生产线、大版和块时 该值为null */
  UnionFlowchartData: OrderFlowchart | null = null

  loading = false

  _originalList: IOrderFlowchartNode[] = []

  public async getProcessListAndGenerateData(targetID: string | number, targetType: ReportModeEnum, oWrap: HTMLElement | undefined) {
    if (!targetID) return;

    this.LineFlowchartList = [];
    this.UnionFlowchartData = null;
    this._originalList = [];

    this.loading = true;

    const resp = await getProcessListApi(targetID, targetType).catch(() => null);

    this.loading = false;

    if (resp?.data?.Status === 1000) {
      // resp.data.Data 对数据进行处理 根据SemiFinish字段： 如果为null则是组合工序流程，否则为单生产线、大版、块，还需要继续进行筛选组合成具体实例列表
      const _lineChartsList:IOrderFlowchartNode[][] = [];
      const _unionCharts: IOrderFlowchartNode[] = [];

      resp.data.Data.forEach(it => {
        if (!it.SemiFinished) {
          // 组合工序
          _unionCharts.push(it);
        } else {
          const t = _lineChartsList.find(c => c.length > 0 && c[0].SemiFinished?.ID === it.SemiFinished?.ID);
          if (t) {
            t.push(it);
          } else {
            _lineChartsList.push([it]);
          }
        }
      });

      this._originalList = resp.data.Data;

      this.LineFlowchartList = _lineChartsList.map(list => new OrderFlowchart(list));

      if (_unionCharts.length > 0) {
        this.UnionFlowchartData = new OrderFlowchart(_unionCharts);

        this.renderLineInstanceArrow(oWrap);
      }
    }
  }

  /** 渲染单生产线到组合生产线上的连接箭头 */
  private async renderLineInstanceArrow(oWrap: HTMLElement | undefined) {
    if (this.LineFlowchartList.length > 0 && oWrap) {
      await nextTick();

      const oLeft: HTMLElement | null = oWrap.querySelector('.left');
      const oRight: HTMLElement | null = oWrap.querySelector('.right');

      if (oLeft && oRight) {
        this.LineFlowchartList.forEach((it) => {
          it.NextOutsideNodes.forEach(node => {
            if (node?._OutsideNextNodeIds && node._OutsideNextNodeIds.length > 0) {
              const start = oLeft.querySelector(`.mp-line-flow-chart-item-comp-wrap[data-taskworkingid="${node.TaskWorkingID}"]`);
              if (!start) return;
              const targets = node._OutsideNextNodeIds
                .map(id => oRight.querySelector(`.mp-line-flow-chart-item-comp-wrap[data-taskworkingid="${id}"]`))
                .filter(el => el);

              targets.forEach(target => {
                if (!target) return;
                const startRect = start.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();
                const distanceX = targetRect.x - (startRect.x + startRect.width);
                const distanceY = targetRect.y - startRect.y;

                const setEndNodeArrowInstance = { distanceX, distanceY };
                it.setEndNodeArrow(setEndNodeArrowInstance, node.TaskWorkingID);
              });
            }
          });
        });
      }
    }
  }
}
