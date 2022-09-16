import api from '@/api';
import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { IAssistListItem } from '../types';

export class AssistInfoItem {
  NoteID = '';

  Name = '';

  Type: localEnumValueIDType = '';

  constructor(data: IAssistListItem | null) {
    if (data) restoreInitDataByOrigin(this, data);
  }

  validate(list: IAssistListItem[]) { // 校验
    const { Name, Type, NoteID } = this;
    if (!Name) {
      MpMessage.error({ title: '保存失败', msg: '请输入名称' });
      return false;
    }

    const t = list.find(it => it.NoteID !== NoteID && it.Name === Name);
    if (t) {
      MpMessage.error({ title: '保存失败', msg: '存在名称重复' });
      return false;
    }

    if (!Type && Type !== 0) {
      MpMessage.error({ title: '保存失败', msg: '请选择类型' });
      return false;
    }

    return true;
  }

  async submit(cb: (temp: IAssistListItem) => void) {
    const temp = CommonClassType.filter({ ...this });
    const resp = await api.getResourceNoteSave(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      const title = this.NoteID ? '编辑成功' : '添加成功';
      const callback = () => {
        const temp: IAssistListItem = {
          NoteID: resp.data.Data,
          Name: this.Name,
          Type: this.Type,
        };
        cb(temp);
      };
      MpMessage.success({ title, onOk: callback, onCancel: callback });
    }
  }
}
