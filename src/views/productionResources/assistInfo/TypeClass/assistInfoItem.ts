import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IAssistListItem } from '../types';
import { AssistInfoTypeEnum } from '../types/enum';

export class AssistInfoItem {
  ID = '';

  Name = '';

  Type: AssistInfoTypeEnum | '' = '';

  Positions: IAssistListItem['Positions'] = []

  ReportWorkings: IAssistListItem['ReportWorkings'] = []

  MapWorkings: IAssistListItem['MapWorkings'] = []

  changeTypeDisabled = false

  constructor(data: IAssistListItem | null) {
    if (data) {
      this.ID = data.ID;
      this.Name = data.Name;
      this.Type = data.Type;
      this.Positions = data.Positions;
      this.ReportWorkings = data.ReportWorkings;
      this.MapWorkings = data.MapWorkings;

      if (this.Positions.length > 0 || this.ReportWorkings.length > 0 || this.MapWorkings.length > 0) {
        this.changeTypeDisabled = true;
      }
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

    return true;
  }

  async submit(cb: (temp: IAssistListItem) => void) {
    const reqData = {
      ID: this.ID,
      Name: this.Name,
      Type: this.Type,
    };

    const resp = await api.getResourceNoteSave(reqData).catch(() => null);

    if (resp?.data?.isSuccess) {
      const title = this.ID ? '编辑成功' : '添加成功';
      const callback = () => {
        if (resp.data) {
          const temp: IAssistListItem = {
            ID: resp.data.Data,
            Name: this.Name,
            Type: Number(this.Type),
            Positions: this.Positions,
            ReportWorkings: this.ReportWorkings,
            MapWorkings: this.MapWorkings,
          };
          cb(temp);
        }
      };

      MpMessage.dialogSuccess({ title, onOk: callback, onCancel: callback });
    }
  }
}
