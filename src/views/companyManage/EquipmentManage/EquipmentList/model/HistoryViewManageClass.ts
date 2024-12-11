import { TEquipment } from '../types';

export class HistoryViewManageClass {
  visible = false

  item: TEquipment | null = null

  open(item: TEquipment) {
    this.item = item;
    this.visible = true;
  }
}
