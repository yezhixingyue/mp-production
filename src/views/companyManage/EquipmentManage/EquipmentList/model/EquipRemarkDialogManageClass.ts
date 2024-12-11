import { EquipmentHistoryTypeEnum } from '../types/enum';

export class EquipRemarkDialogManageClass {
  // 备注弹窗使用
  visible = false

  type = EquipmentHistoryTypeEnum.create;

  open(type: EquipmentHistoryTypeEnum) {
    this.type = type;
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}
