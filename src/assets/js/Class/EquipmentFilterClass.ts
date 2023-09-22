import api from '@/api';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';

export class EquipmentFilterClass {
  /** 几级筛选数据 */
  private level: 2 | 3 = 2

  public EquipmentClassList: EquipmentClassificationListItem[] = [] // 设备分类列表

  public EquipmentGroupList: EquipmentGroupItemType[] = []

  public EquipmentList: IManageEquipmentInfo[] = []

  public EquipmentClassAndGroupLevelList:IListItemType[] = []

  constructor(level?: 2 | 3) {
    if (level) this.level = level;
  }

  private getEquipmentClassList = async () => { // 获取设备分类
    const resp = await api.getEquipmentClassificationList().catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentClassList = resp.data.Data || [];
    }
  }

  private getEquipmentGroupList = async () => { // 获取设备组
    const resp = await api.getEquipmentGroupList({ Page: 1, PageSize: 9999 }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentGroupList = resp.data.Data || [];
    }
  }

  private getEquipmentList = async () => {
    const temp = {
      Page: 1,
      PageSize: 10000,
    };
    const resp = await api.getEquipmentList(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentList = resp.data.Data || [];
    }
  }

  private getEquipmentClassAndGroupLevelList() {
    if (this.EquipmentClassList.length === 0 || this.EquipmentGroupList.length === 0) return [];
    const list = this.EquipmentClassList.map(it => ({
      ...it,
      children: this.EquipmentGroupList.filter(g => g.ClassID === it.ID).map(g => {
        const temp: IListItemType = {
          ...g,
        };

        if (this.level === 3) {
          temp.children = this.EquipmentList.filter(equip => equip.GroupID === g.ID);
        }

        return temp;
      }),
    }));

    return list;
  }

  public async getInitData() {
    let arr: (() => Promise<void>)[] = [];
    if (this.level === 2) {
      arr = [this.getEquipmentClassList, this.getEquipmentGroupList];
    }
    if (this.level === 3) {
      arr = [this.getEquipmentClassList, this.getEquipmentGroupList, this.getEquipmentList];
    }
    await Promise.all(arr.map(func => func()));
    this.EquipmentClassAndGroupLevelList = this.getEquipmentClassAndGroupLevelList();
  }
}
