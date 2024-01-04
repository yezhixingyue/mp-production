import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IExternalReportResult } from './types';

/**
 * 外协加工入库处理类
 *
 * @export
 * @class ExternalReportHandleClass
 */
export class ExternalReportHandleClass {
  isInstored: boolean

  get title() {
    return this.isInstored ? '入库' : '出库';
  }

  /** 外协入库处理结果 */
  result: null | IExternalReportResult = null

  constructor(isInstored: boolean) {
    this.isInstored = isInstored;
  }

  /** 验证输入的外协单号是否正确 */
  private _validateSearch(TaskCode: string, callback: () => void) {
    if (!TaskCode) {
      MpMessage.error(`${this.title}失败`, '请输入外协ID', callback, callback);
      return false;
    }

    if (!/^\d{10}$/.test(TaskCode)) {
      MpMessage.error(`${this.title}失败`, '外协ID输入格式不正确', callback, callback);
      return false;
    }

    return true;
  }

  /** 获取外协入库搜索结果 */
  async search(TaskCode: string, callback: () => void) {
    if (!this._validateSearch(TaskCode, callback)) return false;
    this.result = null;

    const resp = await api.outsourceApis.getExternalFactoryReportDetail(+TaskCode, this.isInstored, callback).catch(() => null);

    if (resp?.data.isSuccess) {
      this.result = resp.data.Data;
      return true;
    }

    return false;
  }

  /** 确认完成 */
  async confirm(callback: () => void) {
    if (!this.result) return;

    const _api = this.isInstored ? api.outsourceApis.getExternalFactoryTaskReport : api.outsourceApis.getExternalFactoryTaskPutOut;

    const resp = await _api(this.result.TaskCode).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        callback();
      };

      const title = this.isInstored ? '入库成功' : '出库成功';

      MpMessage.dialogSuccess(title, cb, cb);
    }
  }

  /** 提交问题 */
  async setQuestion(callback: () => void, Remark: string) {
    if (!this.result) return;
    const resp = await api.outsourceApis.getEquipmentTaskError({
      ID: this.result.TaskID,
      Remark,
    }).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        callback();
      };

      MpMessage.dialogSuccess('问题已提交', cb, cb);
    }
  }
}
