import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ShiftTypeEnum } from '@/views/productionSetting/deliveryTimeManage/enums';
import { Condition } from './Condition';
import { IManageEquipmentInfo, IManageEquipmentTableListItem } from './types';

export class ManageEquipmentListClass {
  public list: IManageEquipmentInfo[] = []

  public listNumber = 0

  public loading = false

  public condition = new Condition()

  public curEditItem: IManageEquipmentTableListItem | null = null

  public EquipmentClassList: EquipmentClassificationListItem[] = [] // 设备分类列表

  public EquipmentGroupList: EquipmentGroupItemType[] = []

  public EquipmentClassAndGroupLevelList:IListItemType[] = []

  clearCondition() {
    this.condition = new Condition();
  }

  /** 解除绑定 */
  static async handleItemUnbind(item: IManageEquipmentInfo) {
    const resp = await api.getEquipmentUnbind(item.ID).catch(() => null);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        const _item = item;
        _item.Terminal = '';
      };
      MpMessage.success({
        title: '解绑成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 开关机 */
  static async handleItemSwitchOpen(item: IManageEquipmentInfo) {
    const resp = await api.getEquipmentOnOffSetup(item.ID, !item.IsOpen).catch(() => null);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        const _item = item;
        _item.IsOpen = !item.IsOpen;
      };
      MpMessage.success({
        title: `设置成功，已${item.IsOpen ? '关机' : '开机'}`,
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 根据运行时间计算并改变当前所有条目的开关机状态 */
  public updateItemIsOpenStatus() {
    // 1. 获取到当前分钟时间点
    const curTimePoint = new Date().getHours() * 60 + new Date().getMinutes();

    // 2. 遍历每个条目 判断其开关机状态并进行对应修改
    this.list.forEach(it => {
      if (it.MaintainInfo.IsAutomatic) { // 如果是自动开关机才继续进行下去
        const _it = it;

        // 1. 判断当前日期是否在规定范围内
        let isRight = false;

        switch (it.MaintainInfo.PeriodType) {
          case ShiftTypeEnum.everyday: // 按天
            isRight = true;
            break;

          case ShiftTypeEnum.weekly: // 按周
            isRight = it.MaintainInfo.ItemList.includes(new Date().getDay());
            break;

          case ShiftTypeEnum.monthly: // 按月
            isRight = it.MaintainInfo.ItemList.includes(new Date().getDate());
            break;

          default:
            break;
        }

        if (!isRight) {
          _it.IsOpen = it.MaintainInfo.LimitOff;
          return;
        }

        // 2. 如果日期符合范围，则继续判断时间段是否在设置范围内
        const t = it.MaintainInfo.PeriodList.find(item => item.Key <= curTimePoint && item.Value >= curTimePoint);
        _it.IsOpen = t ? !it.MaintainInfo.LimitOff : it.MaintainInfo.LimitOff;
      }
    });
  }

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

  private getEquipmentClassAndGroupLevelList() {
    if (this.EquipmentClassList.length === 0 || this.EquipmentGroupList.length === 0) return [];
    const list = this.EquipmentClassList.map(it => ({
      ...it,
      children: this.EquipmentGroupList.filter(g => g.ClassID === it.ID).map(g => ({ ...g, ID: g.ID })),
    }));

    return list;
  }

  public async getList(Page = 1) {
    this.condition.setConditon([['Page', ''], Page]);
    this.list = [];
    const temp = this.condition.filter();
    this.loading = true;
    const resp = await api.getEquipmentList(temp).catch(() => null);
    this.loading = false;
    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  public async getInitData() { // 获取初始数据
    this.getList();
    await Promise.all([this.getEquipmentClassList(), this.getEquipmentGroupList()]);
    this.EquipmentClassAndGroupLevelList = this.getEquipmentClassAndGroupLevelList();
  }
}
