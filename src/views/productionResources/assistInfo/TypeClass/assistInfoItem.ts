import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IAssistListItem } from '../types';
import { INoteDisplayPosition } from '../hooks/useNoteDisplayPositionList';
import { AssistInfoTypeEnum } from './assistListConditionClass';

export class AssistInfoItem {
  ID = '';

  Name = '';

  private Type: AssistInfoTypeEnum | '' = '';

  Position: { [key: string]: boolean; } = {};

  _UsableNoteDisplayPositionList: INoteDisplayPosition[] = [];

  private _EditPositionDataCache = new Map<AssistInfoTypeEnum, { [key: string]: boolean; }>();

  get _LocalType() {
    return this.Type;
  }

  set _LocalType(val: AssistInfoTypeEnum | '') {
    // 1. 存缓存
    if (this.Type !== '') {
      this._EditPositionDataCache.set(this.Type, { ...this.Position });
    }

    // 2. 改变数据
    this.Type = val;
    this._UsableNoteDisplayPositionList = this.NoteDisplayPositionList.filter(it => it.Types.includes(this.Type as AssistInfoTypeEnum));

    // 3. 取缓存
    this._updatePosition(val !== '' ? this._EditPositionDataCache.get(val) : undefined);
  }

  private _updatePosition(cache?: AssistInfoItem['Position']) {
    this.NoteDisplayPositionList.forEach(it => {
      if (this._UsableNoteDisplayPositionList.find(pos => pos.Key === it.Key)) {
        this.Position[it.Key] = cache?.[it.Key] ?? false;
      } else {
        this.Position[it.Key] = false;
      }
    });
  }

  private NoteDisplayPositionList: INoteDisplayPosition[]

  constructor(data: IAssistListItem | null, NoteDisplayPositionList: INoteDisplayPosition[]) {
    this.NoteDisplayPositionList = NoteDisplayPositionList;

    if (data) {
      this.ID = data.ID;
      this.Name = data.Name;
      this._LocalType = data.Type;

      this._updatePosition(data.Position);
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

    if (this._UsableNoteDisplayPositionList.length > 0) {
      const hasPosition = Object.values(this.Position).some(it => it);
      if (!hasPosition) {
        MpMessage.error({ title: '保存失败', msg: '请选择展示位置' });
        return false;
      }
    }

    return true;
  }

  async submit(cb: (temp: IAssistListItem) => void) {
    const reqData = {
      ID: this.ID,
      Name: this.Name,
      Type: this.Type,
      Position: this.Position,
    };

    const resp = await api.getResourceNoteSave(reqData).catch(() => null);

    if (resp?.data?.isSuccess) {
      const title = this.ID ? '编辑成功' : '添加成功';
      const callback = () => {
        if (resp.data) {
          const temp: IAssistListItem = {
            ...reqData,
            ID: resp.data.Data,
            Type: Number(this.Type),
          };
          cb(temp);
        }
      };

      MpMessage.dialogSuccess({ title, onOk: callback, onCancel: callback });
    }
  }
}
