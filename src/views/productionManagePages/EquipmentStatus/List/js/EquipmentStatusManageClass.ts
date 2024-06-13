import api from '@/api';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { nextTick } from 'vue';
import { EquipmentStatusListCondition } from './ConditionClass';
import { ILocalEquipmentStatusItem } from './types';
import { BoardDraw } from './BoardDraw';

export class EquipmentStatusManageClass {
  condition = new EquipmentStatusListCondition()

  list: ILocalEquipmentStatusItem[] = []

  listNumber = 0

  loading = false;

  /** 设备分类列表  需要筛选掉不包含设备的类别 -- 暂无筛选依据 */
  EquipmentClassList: EquipmentClassificationListItem[] = []

  public get curClassID(): number | '' {
    return this.condition.ClassID;
  }

  public set curClassID(val) {
    this.getList(val);
  }

  private boardDraw: null | BoardDraw = null

  private clearBoard() {
    if (!this.boardDraw) return;
    this.boardDraw.clear();
  }

  private drawBoard(list: ILocalEquipmentStatusItem[]) {
    if (!this.boardDraw) return;
    this.boardDraw.draw(list);
  }

  private timer: number | null = null

  setInterval4List(bool = false) {
    if (bool) {
      this.getList(this.condition.ClassID);
      return;
    }
    this.timer = window.setInterval(() => {
      this.getList(this.condition.ClassID);
    }, 60 * 1000);
  }

  clearInterval4List() {
    if (typeof this.timer === 'number') {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** 获取数据列表 */
  private async getList(ClassID: number | '') {
    this.clearInterval4List();

    this.condition.ClassID = ClassID;

    const showLoading = this.list.length === 0;

    // this.list = [];

    this.loading = true;
    // 获取列表数据 然后进行赋值：list listNumber
    const resp = await api.productionManageApis.getEquipmentStatusList(this.condition, showLoading).catch(() => null);

    this.loading = false;

    // 清除原画
    this.clearBoard();

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data.map(it => ({
        ...it,
        _menuBorder: {
          x: 0, y: 0, w: 0, h: 0,
        },
      }));
      this.listNumber = resp.data.DataNumber;
      // 渲染画板
      this.drawBoard(this.list);

      this.setInterval4List();
    } else {
      this.list = [];
      this.drawBoard(this.list);
    }
  }

  get _HoverItemData() {
    return this.boardDraw ? this.boardDraw.hoverTarget : null;
  }

  init(canvas?: HTMLCanvasElement, oLeft?: HTMLElement) {
    this.getEquipmentClassList();
    if (canvas) {
      this.boardDraw = new BoardDraw(canvas, oLeft);
    }
  }

  /** 获取设备分类列表 并且在有数据的情况下 获取数据列表 */
  async getEquipmentClassList() { // 需要对结果进行筛选 或传入参数获取筛选后的数据
    await nextTick();
    this.loading = true;

    const resp = await api.getEquipmentClassificationList(undefined, true).catch(() => null);

    if (resp?.data?.isSuccess) {
      this.EquipmentClassList.push(...resp.data.Data);

      if (resp.data.Data.length > 0 && typeof resp.data.Data[0].ID === 'number') {
        await this.getList(resp.data.Data[0].ID);
      }
    }

    this.loading = false;
  }
}
