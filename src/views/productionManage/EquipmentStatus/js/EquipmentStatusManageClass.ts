import api from '@/api';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { nextTick } from 'vue';
import { EquipmentStatusListCondition } from './ConditionClass';

export class EquipmentStatusManageClass {
  condition = new EquipmentStatusListCondition()

  list: any = []

  listNumber = 0

  loading = false;

  public get curClassID(): number | '' {
    return this.condition.ClassID;
  }

  public set curClassID(val) {
    this.getList(val);
  }

  /** 获取数据列表 */
  async getList(ClassID: number | '') {
    this.condition.ClassID = ClassID;

    this.loading = true;
    // 获取列表数据 然后进行赋值：list listNumber
    const resp = await api.getEquipmentStatusList(this.condition).catch(() => null);
    console.log('获取列表数据', resp);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 设备分类列表  需要筛选掉不包含设备的类别 -- 暂无筛选依据 */
  EquipmentClassList: EquipmentClassificationListItem[] = []

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
