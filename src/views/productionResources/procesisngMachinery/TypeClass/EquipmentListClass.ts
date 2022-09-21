import api from '@/api';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { EquipmentClassificationListItem } from '../../equipmentClassification/types';
import { EquipmentListItemType } from './Equipment';
import { EquipmentListCondition } from './EquipmentListCondition';

export class EquipmentListClass {
  list: EquipmentListItemType[] = []

  listNumber = 0

  loading = false

  condition = new EquipmentListCondition()

  curEditItem: EquipmentListItemType | null = null

  visible = false

  EquipmentClassList: EquipmentClassificationListItem[] = [] // 设备分类列表

  EquipmentGroupList: EquipmentGroupItemType[] = []

  private async getEquipmentClassList() { // 获取设备分类
    const resp = await api.getEquipmentClassificationList().catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentClassList = resp.data.Data;
    }
  }

  private async getEquipmentGroupList() { // 获取设备组
    const resp = await api.getEquipmentGroupList({ Page: 1, PageSize: 9999 }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentGroupList = resp.data.Data;
    }
  }

  // getList
}
