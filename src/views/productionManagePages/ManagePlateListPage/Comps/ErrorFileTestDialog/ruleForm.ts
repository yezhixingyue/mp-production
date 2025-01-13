import { nextTick } from 'vue';
import api from '@/api';
import { IManagePlateInfo } from '../../js/type';

interface IResult {
  ChunkCodeList: string[]
  FilePath: string
}

export class ErrorFileTestDialogRuleForm {
  itemData: IManagePlateInfo

  StartNumber = ''

  EndNumber = ''

  loading = false

  result: null | IResult = null

  tip = ''

  constructor(row: IManagePlateInfo) {
    this.itemData = row;
  }

  private _validate() {
    if (this.StartNumber === '') {
      this.tip = '请输入起始数值';
      return false;
    }

    if (!/^\d+$/.test(String(this.StartNumber)) || Number(this.StartNumber) === 0) {
      this.tip = '起始数值不正确';
      return false;
    }

    if (this.EndNumber === '') {
      this.tip = '请输入结束数值';
      return false;
    }

    if (!/^\d+$/.test(String(this.EndNumber)) || Number(this.EndNumber) === 0) {
      this.tip = '结束数值不正确';
      return false;
    }

    if (Number(this.StartNumber) > Number(this.EndNumber)) {
      this.tip = '起始数值不能大于结束数值';
      return false;
    }

    if (Number(this.EndNumber) > this.itemData.ChunkNumber) {
      this.tip = '结束数值不能超过订单块总数量';
      return false;
    }

    return true;
  }

  async submit() {
    this.tip = '';
    this.result = null;

    await nextTick();

    if (!this._validate()) return;

    const temp = {
      ID: this.itemData.ID,
      StartNumber: Number(this.StartNumber),
      EndNumber: Number(this.EndNumber),
    };

    this.loading = true;
    const resp = await api.productionManageApis.getPlateCreateFileTest(temp);
    this.loading = false;

    if (resp.data?.isSuccess) {
      this.result = resp.data.Data;
    } else {
      this.tip = resp.data?.Message || '服务器请求失败';
    }
  }
}
