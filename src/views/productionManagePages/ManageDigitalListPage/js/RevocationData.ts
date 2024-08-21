import { IDigitalOrderPlateInfo } from './types';

/** 撤销大版相关操作 */
export class RevocationData {
  visible = false

  currentRow: IDigitalOrderPlateInfo | null = null

  Remark = ''

  open(row: IDigitalOrderPlateInfo) {
    this.currentRow = row;
    this.visible = true;
    this.Remark = '';
  }

  close() {
    this.currentRow = null;
    this.visible = false;
  }
}
