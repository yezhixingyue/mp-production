import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { GroupSizeLimitClass } from '@/store/modules/resource/EquipmentGroupTypeClass/GroupSizeLimitClass';
import { EquipmentGroupItemType } from '../EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { IMaterialTypeLimitItemTypeWithName, IMaterialTypeLimitTableItemType, MaterialTypeLimitItemType } from './MaterialTypeLimitItemClass';
import { ILimitConstraintsItem, IMaterialTypeLimitSaveParams } from './types';

export class EquipmentGroupMaterialTypeLimitClass {
  curEquipmentGroupItem: EquipmentGroupItemType | null = null

  list: MaterialTypeLimitItemType[] = []

  loading = false

  curMaterialTypeLimitItemTable:null | IMaterialTypeLimitTableItemType = null

  curConditionItem: null | ILimitConstraintsItem = null

  PropertyList: PropertyListItemType[] = []

  private _isFetchedMaterialTypeIds: string[] = [] // 记录已获取过的物料类型ID

  private async getPropertyList(isAdditional = false) { // 获取物料类型属性列表  参数： 是否为追加
    const allIds = this.list.map(it => it.MaterialTypeID);

    const MaterialTypeList = !isAdditional ? allIds : allIds.filter(id => !this._isFetchedMaterialTypeIds.includes(id));

    if (MaterialTypeList.length === 0) return;

    const options = {
      UseModule: UseModuleEnum.EquipmentGroupMaterialTypeLimit,
      MaterialTypeList,
    };

    const resp = await api.propertyApis.getPropertyList(options).catch(() => null);

    if (resp?.data?.isSuccess) {
      const list = resp.data.Data || [];
      this._isFetchedMaterialTypeIds.push(...MaterialTypeList);
      if (isAdditional) {
        this.PropertyList = [...this.PropertyList, ...list];
      } else {
        this.PropertyList = list;
      }
    }
  }

  private async getList() {
    if (!this.curEquipmentGroupItem) return;
    const groupID = this.curEquipmentGroupItem.ID;

    this.loading = true;
    const resp = await api.getEquipmentGroupMaterialTypeList(groupID).catch(() => null);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      const list = resp.data.Data || [];
      this.list = list.map(it => ({ ...it, LimitConstraints: it.LimitConstraints || [] }));
    }
  }

  public async saveLimitItem(data: IMaterialTypeLimitSaveParams, cb: () => void) {
    const resp = await api.getEquipmentGroupMaterialTypeSave(data).catch(() => null);
    if (resp?.data?.isSuccess) {
      const callback = async () => {
        const list = data.MaterialTypeIDS.map(id => ({ MaterialTypeID: id, LimitNumber: 0 }));
        this.curEquipmentGroupItem?.MaterialConstraints.unshift(...list);
        await this.getList();
        if (cb) cb();
        this.getPropertyList(true);
      };
      MpMessage.dialogSuccess({ title: '添加成功', onOk: callback, onCancel: callback });
    }
  }

  public async removeLimitItem(item: IMaterialTypeLimitItemTypeWithName) {
    const resp = await api.getEquipmentGroupMaterialTypeRemove(item.ID).catch(() => null);
    if (resp?.data?.isSuccess) {
      const callback = async () => {
        if (this.curEquipmentGroupItem) {
          const i = this.curEquipmentGroupItem.MaterialConstraints.findIndex(it => it.MaterialTypeID === item.MaterialTypeID);
          if (i > -1) this.curEquipmentGroupItem.MaterialConstraints.splice(i, 1);
        }
        const i = this.list.findIndex(it => it.ID === item.ID);
        if (i > -1) this.list.splice(i, 1);
      };
      MpMessage.success({ title: '删除成功', onOk: callback, onCancel: callback });
    }
  }

  public async setItemSizeLimit(data: GroupSizeLimitClass, callback: () => void) {
    const temp = {
      ID: data.ID,
      MinSizeWidh: data.MinWidth,
      MaxSizeWidh: data.MaxWidth,
      MinSizeLength: data.MinLength,
      MaxSizeLength: data.MaxLength,
    };
    const resp = await api.getEquipmentGroupMaterialTypeSizeSetUp(temp).catch(() => null);

    if (resp?.data?.isSuccess) {
      const cb = async () => {
        const t = this.list.find(it => it.ID === data.ID);
        if (t) {
          t.MaxSizeLength = data.MaxLength;
          t.MaxSizeWidh = data.MaxWidth;
          t.MinSizeLength = data.MinLength;
          t.MinSizeWidh = data.MinWidth;
        }
        callback();
      };
      MpMessage.dialogSuccess({ title: '设置成功', onOk: cb, onCancel: cb });
    }
  }

  public handlerConditionItemChange({ conditonItem, isEdit, isRemove }: { conditonItem: ILimitConstraintsItem, isEdit: boolean, isRemove: boolean }) {
    if (!this.curMaterialTypeLimitItemTable) return;
    if (isEdit || isRemove) {
      const i = this.curMaterialTypeLimitItemTable.LimitConstraints.findIndex(it => it.ID === conditonItem.ID);
      if (i > -1) {
        if (isRemove) {
          this.curMaterialTypeLimitItemTable.LimitConstraints.splice(i, 1);
          if (this.curEquipmentGroupItem) {
            const t = this.curEquipmentGroupItem.MaterialConstraints
              .find(it => this.curMaterialTypeLimitItemTable && it.MaterialTypeID === this.curMaterialTypeLimitItemTable.MaterialTypeID);
            if (t) t.LimitNumber -= 1;
          }
          return;
        }
        if (isEdit) {
          this.curMaterialTypeLimitItemTable.LimitConstraints.splice(i, 1, conditonItem);
        }
      }
    } else { // 新增
      // if (!this.curMaterialTypeLimitItemTable.LimitConstraints) this.curMaterialTypeLimitItemTable.LimitConstraints = [];
      this.curMaterialTypeLimitItemTable.LimitConstraints.unshift(conditonItem);
      if (this.curEquipmentGroupItem) {
        const t = this.curEquipmentGroupItem.MaterialConstraints
          .find(it => this.curMaterialTypeLimitItemTable && it.MaterialTypeID === this.curMaterialTypeLimitItemTable.MaterialTypeID);
        if (t) t.LimitNumber += 1;
      }
    }
  }

  public async init(item: EquipmentGroupItemType) {
    this.curEquipmentGroupItem = item;
    this.list = [];
    this.loading = false;
    this.PropertyList = [];
    this._isFetchedMaterialTypeIds = [];
    await this.getList();
    this.getPropertyList();
  }

  public setCurMaterialTypeLimitItem(item: IMaterialTypeLimitTableItemType, conditonItem) { // 当前正在设置条件的物料类型
    this.curMaterialTypeLimitItemTable = item;
    this.curConditionItem = conditonItem;
  }
}
