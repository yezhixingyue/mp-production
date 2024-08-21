/* eslint-disable max-classes-per-file */
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { InputInstance } from 'element-plus';
import { IChunkDetail } from './type';

class Result {
  code = ''

  data: null | IChunkDetail = null

  /** 补打张数 */
  count = ''

  QRCodeSrc = ''
}

/** 补打标签页面管理类 */
export class ManageTagRePrintClass {
  keywords = ''

  result = new Result()

  private _validate() {
    if (!this.keywords) {
      MpMessage.error('操作失败', '请扫描或输入标签号');
      return false;
    }

    const reg = /^\d+-\d+-\d{4}-\d+$/;

    if (!reg.test(this.keywords)) {
      MpMessage.error('操作失败', '标签号格式不正确');
      return false;
    }

    return true;
  }

  /** 执行搜索 */
  async search(oElInput: InputInstance) {
    if (this.result.code === this.keywords) {
      this.keywords = '';
      oElInput.blur();
      return;
    }

    // 1. 清除result
    this.result = new Result();

    // 2. 校验keywords
    if (!this._validate()) {
      return;
    }

    // 3. 执行请求
    const resp = await api.productionManageApis.getChunkDetail(this.keywords);

    // 4. 保存结果
    if (resp.data?.isSuccess) {
      this.result.code = this.keywords;
      this.result.data = resp.data.Data;

      this.keywords = '';
      oElInput.blur();
    }
  }

  /** 打印 */
  validatePrint() {
    if (!this.result.code) return false;

    if (this.result.count === '') {
      MpMessage.error('操作失败', '请输入补打张数');
      return false;
    }

    if (!/^\d+$/.test(this.result.count)) {
      MpMessage.error('操作失败', '补打张数格式不正确');
      return false;
    }

    if (`${this.result.count}` === '0') {
      MpMessage.error('操作失败', '补打张数不能为0');
      return false;
    }

    return true;
  }
}
