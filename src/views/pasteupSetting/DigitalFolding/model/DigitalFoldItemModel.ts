import api from '@/api';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElMessage } from 'element-plus';
import { DigitalFoldRollWidthList, DigitalFoldTypeEnum, DigitalFoldTypeEnumList } from '../types/enum';
import { IDigitalFoldInfo } from '../types/types';

export class DigitalFoldItemModel {
  ID: number | '' = ''

  MinValue: number | string = ''

  MaxValue: number | string = ''

  FoldType = DigitalFoldTypeEnum.F4

  RollWidth: number = DigitalFoldRollWidthList[0]

  CreateTime = ''

  rawData: null | IDigitalFoldInfo

  isEditing = false

  key = Math.random().toString(16).slice(-8) + Date.now()

  constructor(raw: IDigitalFoldInfo | null) {
    this.rawData = raw;

    if (raw) {
      this.initial();
    }
  }

  /** 初始化数值 | 还原初始设置 */
  initial() {
    const temp = this.rawData || new DigitalFoldItemModel(null);

    this.ID = temp.ID;
    this.MinValue = temp.MinValue;
    this.MaxValue = temp.MaxValue;
    this.FoldType = temp.FoldType;
    this.RollWidth = temp.RollWidth;
    this.CreateTime = temp.CreateTime;
  }

  /** 获取用于保存的提交数据 */
  getParams(list: IDigitalFoldInfo[]) {
    try {
      // 1. 校验
      const _checkIsNumber = (val: number | string, title: string) => {
        if (val === '') {
          throw new Error(`${title}未填写`);
        }
        if (!/^\d+(\.\d{1})?$/.test(String(val))) {
          throw new Error(`${title}不正确，请输入数字类型，最多1位小数且不能为负`);
        }

        return Number(val);
      };

      const min = _checkIsNumber(this.MinValue, '审稿宽最小值');
      const max = _checkIsNumber(this.MaxValue, '审稿宽最大值');

      // 两个数值间的比较
      if (min >= max) {
        throw new Error('审稿宽最小值(左侧)必须小于最大值(右侧)');
      }
      if (max > 1000) {
        throw new Error('审稿宽最大值不能超过1000');
      }

      // 和其它组之间的数值比较 - 不能有重复区间
      const _list = list.filter(it => it !== this.rawData);
      const t = _list.find(it => max > it.MinValue && min < it.MaxValue);
      if (t) {
        throw new Error(`当前设置区间与已有区间 (${t.MinValue},${t.MaxValue}] 重叠`);
      }

      if (!DigitalFoldTypeEnumList.find(it => it.ID === this.FoldType)) {
        throw new Error('折手方式不在可用范围内');
      }

      if (!DigitalFoldRollWidthList.find(it => it === this.RollWidth)) {
        throw new Error('用料卷宽不在可用范围内');
      }

      // 2. 组装数据
      const temp = {
        ID: this.ID,
        MinValue: Number(this.MinValue),
        MaxValue: Number(this.MaxValue),
        FoldType: this.FoldType,
        RollWidth: this.RollWidth,
        CreateTime: this.CreateTime,
      };

      return { data: temp, error: '' };
    } catch (err: unknown) {
      return { data: null, error: err instanceof Error ? err.message : String(err) };
    }
  }

  /** 保存 */
  async save(list: IDigitalFoldInfo[]) {
    if (!this.isEditing) return;

    const { data, error } = this.getParams(list);
    if (!data) {
      MpMessage.error('保存失败', error);
      return;
    }

    const resp = await api.getFoldingTemplateDigitalSave(data);
    if (resp.data?.isSuccess) {
      const cb = () => {
        this.rawData = {
          ...data,
          ID: data.ID ? data.ID : Number(resp.data!.Data),
        };

        if (!data.ID && !this.rawData.CreateTime) {
          this.rawData.CreateTime = getTimeConvertFormat({ withHMS: true });
        }

        this.cancelEdit(); // 调用方法完成初始化
      };

      MpMessage.success({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 取消编辑 */
  cancelEdit() {
    if (!this.rawData) {
      ElMessage.error('该条数据尚未保存，请先保存数据');
      return;
    }
    this.initial();
    this.isEditing = false;
  }
}
