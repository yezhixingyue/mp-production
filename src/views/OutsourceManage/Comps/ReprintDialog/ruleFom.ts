import api from '@/api';

/** 补打外协单提交表单 */
export class OutsourceOrderRePrintForm {
  /** 输入的外协任务编号 */
  code = ''

  /** 错误信息 */
  errMsg = ''

  async submit() {
    this.errMsg = '';

    // 校验
    if (!this.code) {
      this.errMsg = '请输入任务ID';
      return null;
    }

    if (!/^\d{10,}$/.test(this.code)) {
      this.errMsg = '任务ID输入格式不正确';
      return null;
    }

    const resp = await api.outsourceApis.getExternalFactoryRePrint(this.code);

    if (resp.data?.isSuccess) {
      // 补打成功
      return resp.data.Data;
    }

    this.errMsg = resp.data?.Message || resp.message || '补打失败';
    return null;
  }
}
