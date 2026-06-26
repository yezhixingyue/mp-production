import { MpMessage } from '@/assets/js/utils/MpMessage';
import { localPrepressAdjModel } from '../../store';
import { IAdjustPermissionInfo } from '../../types';

export class RuleForm {
  /** 员工ID */
  ID = ''

  /** 员工名称 */
  Name = ''

  /** 选中生产线列表 */
  lineIDs: string[] = []

  constructor(item: IAdjustPermissionInfo | null) {
    if (item) {
      this.ID = item.ID;
      this.Name = item.Name;
      this.lineIDs = item.LineList.map(it => it.ID);
    }
  }

  getParams(): IAdjustPermissionInfo | null {
    if (!this.ID || !this.Name) {
      MpMessage.error('操作失败', '负责人信息不完整');
      return null;
    }

    const LineList = this.lineIDs
      .map(id => localPrepressAdjModel.value.ProductionLineList.find(it => it.ID === id))
      .filter(Boolean)
      .map(it => ({ ID: it!.ID, Name: it!.Name }));

    if (LineList.length === 0) {
      MpMessage.error('操作失败', '未获取到有效的生产线信息');
      return null;
    }

    const temp: IAdjustPermissionInfo = {
      ID: this.ID,
      Name: this.Name,
      LineList,
    };

    return temp;
  }
}
