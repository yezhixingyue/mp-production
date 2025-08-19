import api from '@/api';
import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { IAssistListItem } from '../types';
import { INoteDisplayPosition } from '../hooks/useNoteDisplayPositionList';
import { AssistInfoTypeEnum } from './assistListConditionClass';

export class AssistInfoItem implements IAssistListItem {
  ID = '';

  Name = '';

  Type: localEnumValueIDType = '';

  Position: { [key: string]: boolean; } = {};

  constructor(data: IAssistListItem | null, NoteDisplayPositionList: INoteDisplayPosition[]) {
    NoteDisplayPositionList.forEach(it => {
      this.Position[it.Key] = false;
    });

    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }

  validate(list: IAssistListItem[]) { // 校验
    if (!this.Name) {
      MpMessage.error({ title: '保存失败', msg: '请输入名称' });
      return false;
    }

    const t = list.find(it => it.ID !== this.ID && it.Name === this.Name);
    if (t) {
      MpMessage.error({ title: '保存失败', msg: '存在名称重复' });
      return false;
    }

    if (!this.Type && this.Type !== 0) {
      MpMessage.error({ title: '保存失败', msg: '请选择类型' });
      return false;
    }

    if (this.Type === AssistInfoTypeEnum.text) {
      const hasPosition = Object.values(this.Position).some(it => it);
      if (!hasPosition) {
        MpMessage.error({ title: '保存失败', msg: '请选择展示位置' });
        return false;
      }
    }

    return true;
  }

  async submit(cb: (temp: IAssistListItem) => void) {
    const temp = CommonClassType.filter({ ...this });
    const resp = await api.getResourceNoteSave(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      const title = this.ID ? '编辑成功' : '添加成功';
      const callback = () => {
        if (resp.data) {
          const temp: IAssistListItem = {
            ...this,
            ID: resp.data.Data,
          };
          cb(temp);
        }
      };
      MpMessage.dialogSuccess({ title, onOk: callback, onCancel: callback });
    }
  }
}
