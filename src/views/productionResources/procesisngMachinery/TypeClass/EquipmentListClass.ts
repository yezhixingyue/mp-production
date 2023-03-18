import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { EquipmentClassificationListItem } from '../../equipmentClassification/types';
import { Equipment, EquipmentListItemType, EquipmentSubmitDataType } from './Equipment';
import { EquipmentListCondition } from './EquipmentListCondition';

export enum EquipmentTableMenuEnumType {
  edit,
  remove,
  setState
}

export class EquipmentListClass {
  public list: EquipmentListItemType[] = []

  public listNumber = 0

  public loading = false

  public condition = new EquipmentListCondition()

  public curEditItem: EquipmentListItemType | null = null

  public visible = false

  public EquipmentClassList: EquipmentClassificationListItem[] = [] // 设备分类列表

  public EquipmentGroupList: EquipmentGroupItemType[] = []

  public EquipmentClassAndGroupLevelList:IListItemType[] = []

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
    // this.condition.Page = Page;
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

  public async fetchInitRequiredData() { // 获取初始数据
    this.getList();
    await Promise.all([this.getEquipmentClassList(), this.getEquipmentGroupList()]);
    this.EquipmentClassAndGroupLevelList = this.getEquipmentClassAndGroupLevelList();
  }

  public async handleItemSubmit(data: Equipment) {
    const temp: EquipmentSubmitDataType = {
      ID: data.ID,
      GroupID: data.GroupID,
      Name: data.Name,
      Index: data.Index,
    };
    const resp = await api.getEquipmentSave(temp).catch(() => null);
    if (resp?.data.isSuccess) {
      const isEdit = this.curEditItem;

      const title = isEdit ? '编辑成功' : '添加成功';

      const cb = () => {
        if (isEdit) {
          const i = this.list.findIndex(it => it.ID === data.ID);
          if (i > -1) {
            const it: EquipmentListItemType = { ...this.list[i], ...temp, ClassID: data.ClassID };
            this.list.splice(i, 1, it);
          }
        } else {
          const it: EquipmentListItemType = { ...data, ID: resp.data.Data };
          this.list.unshift(it);
          this.listNumber += 1;
        }
        this.visible = false;
      };

      MpMessage.dialogSuccess({ title, onOk: cb, onCancel: cb });
    }
  }

  public async handleItemRemove(data: EquipmentListItemType) {
    const resp = await api.getEquipmentRemove(data.ID).catch(() => null);
    if (resp?.data.isSuccess) {
      const cb = () => {
        const i = this.list.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          this.list.splice(i, 1);
          this.listNumber -= 1;
        }
      };
      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  }

  public async handleItemSetState(data: EquipmentListItemType) {
    const temp = { IsUseable: !data.IsUseable, ID: data.ID };
    const resp = await api.getEquipmentSetStatus(temp).catch(() => null);
    if (resp?.data.isSuccess) {
      const title = temp.IsUseable ? '设置成功，已启用' : '设置成功，已停用';
      const cb = () => {
        const it = this.list.find(it => it.ID === data.ID);
        if (it) {
          it.IsUseable = temp.IsUseable;
        }
      };
      MpMessage.success({ title, onOk: cb, onCancel: cb });
    }
  }
}
