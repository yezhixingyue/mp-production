import { ShiftTypeEnum } from '@/views/productionSetting/deliveryTimeManage/enums';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import api from '@/api';
import { getGoBackFun } from '@/router';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IEquipmentMaintainInfo, IManageEquipmentTableListItem } from '../../ManageEquipmentListPage/js/types';
import { IKeyValuePairInEdit } from './types';
import { ManageEquipmentListPageData } from '../../js/store';

const getFormatValue = (it: IKeyValuePairInEdit) => {
  let _First = '';
  let _Second = '';
  if (it) {
    const { Key, Value } = it;
    if (Key || Key === 0) {
      _First = `${`0${Math.floor(Key / 60)}`.slice(-2)}:${`0${Key % 60}`.slice(-2)}`;
    }
    if (Value || Value === 0) {
      _Second = `${`0${Math.floor(Value / 60)}`.slice(-2)}:${`0${Value % 60}`.slice(-2)}`;
    }
  }

  return { _First, _Second };
};

export class EquipmentRunTimeClass {
  ID = ''

  IsAutomatic = true

  LimitOff = true

  PeriodType = ShiftTypeEnum.everyday

  ItemList: number[] = []

  PeriodList: IKeyValuePairInEdit[] = []

  _WeekTypeLimit: number[] = []

  _MonthTypeLimit: number[] = []

  _originData: null | IManageEquipmentTableListItem = null

  constructor(data?: IManageEquipmentTableListItem) {
    if (data) {
      restoreInitDataByOrigin(this, data.MaintainInfo);
      this._originData = data;
    }
    switch (this.PeriodType) {
      case ShiftTypeEnum.weekly:
        this._WeekTypeLimit = [...this.ItemList];
        break;

      case ShiftTypeEnum.monthly:
        this._MonthTypeLimit = [...this.ItemList];
        break;

      default:
        break;
    }
    this.PeriodList = this.PeriodList.map(it => ({
      ...it,
      ...getFormatValue(it),
      _key: Math.random().toString(16).slice(-10),
    }));

    if (this.PeriodList.length === 0) {
      this.generatePeriodItem();
    }
  }

  /** 添加一个时间段 */
  generatePeriodItem() {
    const item: IKeyValuePairInEdit = {
      Key: '',
      Value: '',
      _key: Math.random().toString(16).slice(-10),
      _First: '',
      _Second: '',
    };

    this.PeriodList.push(item);
  }

  private _check() {
    if (!this.IsAutomatic) {
      return true;
    }

    if (this.PeriodType === ShiftTypeEnum.weekly && this._WeekTypeLimit.length === 0) {
      MpMessage.error({
        title: '保存失败',
        msg: '请选择每周时间',
      });
      return false;
    }

    if (this.PeriodType === ShiftTypeEnum.monthly && this._MonthTypeLimit.length === 0) {
      MpMessage.error({
        title: '保存失败',
        msg: '请选择每月日期',
      });
      return false;
    }

    const i = this.PeriodList.findIndex(it => !it._First || !it._Second);
    if (i > -1) {
      MpMessage.error({
        title: '保存失败',
        msg: `开机时间中，第${i + 1}条时间设置不完整，请检查`,
      });
      return false;
    }

    const allTimes: string[] = [];
    this.PeriodList.forEach(it => {
      allTimes.push(it._First, it._Second);
    });
    const index = allTimes.findIndex((it, i) => {
      if (i === allTimes.length - 1) return false;
      const t1 = +it.split(':')[0] * 60 + +it.split(':')[1];
      const t2 = +allTimes[i + 1].split(':')[0] * 60 + +allTimes[i + 1].split(':')[1];

      return t1 >= t2;
    });
    if (index > -1) {
      const num = Math.floor(index / 2) + 1;
      MpMessage.error({
        title: '保存失败',
        msg: `开机时间中，${index % 2 ? `第${num + 1}条中开始时间` : `第${num}条中的结束时间`}必须晚于${index % 2 ? `第${num}条中的结束时间` : '开始时间'}`,
      });
      return false;
    }

    return true;
  }

  private _getSubmitParams() {
    // 0
    if (!this.IsAutomatic) {
      return {
        ID: this.ID,
        IsAutomatic: this.IsAutomatic,
      };
    }
    // 1. 转换ShiftTime数据
    this.PeriodList.forEach(it => {
      if (!it._First || !it._Second) return;
      let [First, Second] = it._First.split(':');
      const _it = it;
      _it.Key = +First * 60 + +Second;
      [First, Second] = it._Second.split(':');
      _it.Value = +First * 60 + +Second;
    });

    // 2. TypeLimit确定赋值
    let ItemList: number[] = [];
    switch (this.PeriodType) {
      case ShiftTypeEnum.weekly:
        ItemList = [...this._WeekTypeLimit];
        break;

      case ShiftTypeEnum.monthly:
        ItemList = [...this._MonthTypeLimit];
        break;

      default:
        break;
    }
    // 3. 对TypeLimit进行排序
    ItemList.sort((a, b) => a - b);

    const temp: IEquipmentMaintainInfo = {
      ID: this.ID,
      PeriodType: this.PeriodType,
      ItemList,
      PeriodList: this.PeriodList.map(it => ({ Key: it.Key, Value: it.Value })) as { Key: number; Value: number; }[],
      IsAutomatic: this.IsAutomatic,
      LimitOff: this.LimitOff,
    };
    return temp;
  }

  public async submit() {
    // 1. 验证
    if (!this._check()) return;

    // 2. 获取提交数据
    const data = this._getSubmitParams();

    // 3. 提交

    const resp = await api.getEquipmentMaintainSetup(data).catch(() => null);
    if (!resp?.data.isSuccess) return;

    // 4. 提交成功后对原数据的修改及页面返回
    const cb = () => {
      if (this._originData) {
        restoreInitDataByOrigin(this._originData.MaintainInfo, data);
        ManageEquipmentListPageData.value.updateItemIsOpenStatus();
      }
      getGoBackFun();
    };

    MpMessage.success({ title: '设置成功', onCancel: cb, onOk: cb });
  }
}
