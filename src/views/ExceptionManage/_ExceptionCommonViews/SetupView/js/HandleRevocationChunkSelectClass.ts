import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IExceptionPlate } from '../../js/type';
import { IRevocationChunk4RuleForm } from './ruleFormType';

export class HandleRevocationChunkSelectClass {
  PlateDetail: IExceptionPlate

  ChunkList: IRevocationChunk4RuleForm[] = []

  CurrentTaskOrderID?: string

  _lastOrderIDString = '' // 记录上一次请求成功后的id 以区分重复请求

  constructor(data: IExceptionPlate, CurrentTaskOrderID?: string) {
    console.log('HandleRevocationChunkSelectClass constructor data', data);
    this.PlateDetail = data;
    this.ChunkList = [];

    this.CurrentTaskOrderID = CurrentTaskOrderID;
  }

  /** 多个ID使用半角逗号（，）隔开，最多可填写10个订单 */
  async getChunkList(OrderCodeListString: string) {
    if (!OrderCodeListString) {
      MpMessage.error('查询失败', '请输入订单ID');
      return;
    }
    if (!/^\d{1,2}-\d{5,10}(,\d{1,2}-\d{5,10})*$/.test(OrderCodeListString)) {
      MpMessage.error('查询失败', '订单ID输入格式不正确');
      return;
    }
    const list = OrderCodeListString.split(',');
    if (list.length > [...new Set(list)].length) {
      MpMessage.error('查询失败', '订单ID输入重复');
      return;
    }
    if (list.length > 10) {
      MpMessage.error('查询失败', '最多输入10个订单ID');
      return;
    }
    if (this._lastOrderIDString === OrderCodeListString && this.ChunkList.length > 0) { // 重复请求
      return;
    }

    this.ChunkList = [];

    const temp = {
      ID: this.PlateDetail.ID,
      OrderCodeListString,
      CurrentTaskOrderID: this.CurrentTaskOrderID,
    };

    if (!this.CurrentTaskOrderID) delete temp.CurrentTaskOrderID;

    const resp = await api.ExceptionHandlerApis.getPlateChunkList(temp).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.ChunkList = resp.data.Data.map(it => ({ ...it, checked: false }));
      this._lastOrderIDString = OrderCodeListString;

      if (this.ChunkList.length === 0) {
        MpMessage.error('未检索到块信息', '请更改搜索内容');
      }
    }
  }
}
