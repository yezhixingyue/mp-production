import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import CommonClassType, { ISetConditionParams } from '../../formattingTime/CommonClassType';
import { EquipmentGroupItemClass, EquipmentGroupItemType } from './EquipmentGroupItemClass';
import { GroupColorLimitClass } from './GroupColorLimitClass';
import { GroupListConditionClass } from './GroupListConditionClass';
import { GripperSetupClass, GripperTypeEnum } from './GripperSetupClass';
// import { GroupSizeLimitClass } from './GroupSizeLimitClass';

export enum EquipmentGroupMenuEnumType {
  /** 叼口 */
  gripper,
  material,
  color,
  edit,
  remove,
}

/** 设备组列表管理类 */
export class EquipmentGroupTypeClass {
  condition = new GroupListConditionClass()

  DataList: EquipmentGroupItemType[] = []

  DataNumber = 0

  curEditItem: EquipmentGroupItemType | null = null

  setConditon(e: ISetConditionParams) {
    CommonClassType.setCondition(e, this.condition);
  }

  clearCondition() {
    this.condition = new GroupListConditionClass();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;
    this.DataList = [];
    const temp = CommonClassType.filter(this.condition);
    const resp = await api.getEquipmentGroupList(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.DataList = resp.data.Data;
      this.DataNumber = resp.data.DataNumber;
    }
  }

  setCurEditItem(item: EquipmentGroupItemType | null) { // 设置当前正在编辑的项目
    this.curEditItem = item;
  }

  async save(item: EquipmentGroupItemClass, closeDialogFunc: () => void) { // 新增|编辑
    const temp = CommonClassType.filter(item);
    const resp = await api.getEquipmentGroupSave(temp).catch(() => null);
    if (resp?.data.isSuccess) {
      const isEdit = !!this.curEditItem;

      const title = isEdit ? '编辑成功' : '添加成功';

      const callback = () => {
        if (!isEdit) {
          this.DataList.unshift({ ...item, ID: resp.data.Data });
          this.DataNumber += 1;
        } else {
          const i = this.DataList.findIndex(it => it.ID === item.ID);
          if (i > -1) {
            this.DataList.splice(i, 1, item);
          }
        }
        if (closeDialogFunc) closeDialogFunc();
      };

      MpMessage.dialogSuccess({ title, onOk: callback, onCancel: callback });
    }
  }

  async remove(item: EquipmentGroupItemType) { // 删除
    const resp = await api.getEquipmentGroupRemove(item.ID).catch(() => null);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        const i = this.DataList.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          this.DataList.splice(i, 1);
          this.DataNumber -= 1;
        }
      };

      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  }

  // async setSizeLimit(data: GroupSizeLimitClass, closeDialogFunc: () => void) { // 设置尺寸限制
  //   const resp = await api.getEquipmentGroupSizeLimit(data).catch(() => null);
  //   if (resp?.data.isSuccess) {
  //     const cb = () => {
  //       const i = this.DataList.findIndex(it => it.ID === data.ID);
  //       if (i > -1) {
  //         const temp = { ...this.DataList[i], ...data };
  //         this.DataList.splice(i, 1, temp);
  //       }
  //       if (closeDialogFunc) closeDialogFunc();
  //     };

  //     MpMessage.dialogSuccess({ title: '尺寸限制设置成功', onOk: cb, onCancel: cb });
  //   }
  // }

  async setColorLimit(data: GroupColorLimitClass, closeDialogFunc: () => void) { // 设置尺寸限制
    const resp = await api.getEquipmentGroupColorLimit(data).catch(() => null);
    if (resp?.data.isSuccess) {
      const cb = () => {
        const i = this.DataList.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          const temp = { ...this.DataList[i], ...data };
          this.DataList.splice(i, 1, temp);
        }
        if (closeDialogFunc) closeDialogFunc();
      };

      MpMessage.dialogSuccess({ title: '印色数量限制设置成功', onOk: cb, onCancel: cb });
    }
  }

  async setGripperLimit(data: GripperSetupClass, closeDialogFunc: () => void) { // 叼口设置
    const _data: Omit<GripperSetupClass, '_validate'> = { ...data };
    if (_data.BiteMouthType === GripperTypeEnum.empty) _data.BiteMouthSize = 0;
    const resp = await api.getEquipmentGroupSetBiteMouth(_data).catch(() => null);
    if (resp?.data.isSuccess) {
      const cb = () => {
        const i = this.DataList.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          const temp = { ...this.DataList[i], ..._data };
          this.DataList.splice(i, 1, temp);
        }
        if (closeDialogFunc) closeDialogFunc();
      };

      MpMessage.dialogSuccess({ title: '叼口设置成功', onOk: cb, onCancel: cb });
    }
  }
  // 其它方法： 设置物料限制、设置印色数量限制等  api.getEquipmentGroupSave

  // public async submitMaterialTypeLimitSave(data: IMaterialTypeLimitSaveParams, cb: () => void) { // 后面改成仅修改列表项数据 curEditItem 或者通过curEditItem直接在另外一个类中修改
  //   const resp = await api.getEquipmentGroupMaterialTypeSave(data).catch(() => null);
  //   if (resp?.data.isSuccess) {
  //     const callback = () => {
  //       console.log(resp, this.curEditItem, cb);
  //       // 处理数据变动
  //       if (cb) cb();
  //     };
  //     MpMessage.success({ title: '添加成功', onOk: callback, onCancel: callback });
  //   }
  // }

  EquipmentClassList: EquipmentClassificationListItem[] = [] // 设备分类列表

  private async getEquipmentClassList() {
    const resp = await api.getEquipmentClassificationList().catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentClassList = resp.data.Data;
    }
  }

  SubcontractorFactoryList: ISubcontractorFactoryListItemType[] = []

  private async getSubcontractorFactoryLis() { // 外协工厂列表 -- 全部 -- 保存弹窗中根据设备分类类型进行筛选
    const resp = await api.getSubcontractorFactoryList({ Page: 1, PageSize: 9999 }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.SubcontractorFactoryList = resp.data.Data;
    }
  }

  fetchRequiredData() {
    this.clearCondition();
    this.getList();
    this.getEquipmentClassList();
    this.getSubcontractorFactoryLis();
  }
}
