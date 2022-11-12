import api from '@/api';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { nextTick } from 'vue';
import { EquipmentStatusListCondition } from './ConditionClass';
import { IEquipmentStatusItem } from './types';
import { BoardDraw } from './BoardDraw';

export class EquipmentStatusManageClass {
  condition = new EquipmentStatusListCondition()

  list: IEquipmentStatusItem[] = []

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

  private drawBoard(list: IEquipmentStatusItem[]) {
    if (!this.boardDraw) return;
    this.boardDraw.draw(list);
  }

  /** 获取数据列表 */
  async getList(ClassID: number | '') {
    this.condition.ClassID = ClassID;

    // 清除原画
    this.clearBoard();

    this.loading = true;
    // 获取列表数据 然后进行赋值：list listNumber
    const resp = await api.getEquipmentStatusList(this.condition).catch(() => null);
    console.log('获取列表数据', resp);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
      // 画图
      this.drawBoard(resp.data.Data);
    }
  }

  init(canvas?: HTMLCanvasElement) {
    this.getEquipmentClassList();
    if (canvas) {
      this.boardDraw = new BoardDraw(canvas);
    }
  }

  /** 获取设备分类列表 并且在有数据的情况下 获取数据列表 */
  async getEquipmentClassList() { // 需要对结果进行筛选 或传入参数获取筛选后的数据
    await nextTick();
    this.loading = true;

    const resp = await api.getEquipmentClassificationList().catch(() => null);

    if (resp?.data.isSuccess) {
      this.EquipmentClassList.push(...resp.data.Data);

      if (resp.data.Data.length > 0 && typeof resp.data.Data[0].ID === 'number') {
        await this.getList(resp.data.Data[0].ID);
      }
    }

    this.loading = false;
  }
}
