import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';
import { useUserStore } from '@/store/modules/user';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { ExceptionHandlerStatusEnum } from '../../js/enum';
import { ITaskExceptionDetail, ITaskExceptionInfo } from '../../js/type';
import { HandleExceptionRuleForm } from './HandleExceptionRuleForm';

export class HandleExceptionClass {
  /** 是否为外协异常 */
  IsOutSourcing = false

  /** 当前正在处理的列表条目 */
  rowData: ITaskExceptionInfo | null = null

  /** 异常任务详细信息 */
  TaskExceptionDetail: null | ITaskExceptionDetail = null

  /** 异常处理提交表单 */
  ruleForm: HandleExceptionRuleForm

  constructor(IsOutSourcing: boolean, rowData: ITaskExceptionInfo | null) {
    this.IsOutSourcing = IsOutSourcing;
    this.rowData = rowData;
    this.ruleForm = new HandleExceptionRuleForm(IsOutSourcing);
  }

  /** 获取异常任务详细信息 */
  async getTaskExceptionDetail() {
    if (!this.rowData) return;

    const resp = await api.ExceptionHandlerApis.getProductionExceptionDetail(this.rowData.ID).catch(() => null);

    if (resp?.data?.isSuccess) {
      this.TaskExceptionDetail = resp.data.Data;
      this.ruleForm.init(resp.data.Data);
    }
  }

  async submit() {
    const temp = this.ruleForm.getSubmitParams();
    if (!temp) return;

    const resp = await api.ExceptionHandlerApis.getProductionExceptionHandling(temp).catch(() => null);

    if (resp?.data?.isSuccess) {
      const cb = () => {
        if (this.rowData) {
          this.rowData.Status = ExceptionHandlerStatusEnum.processed;
          this.rowData.HandlerTime = getTimeConvertFormat({ withHMS: true });
          const userStore = useUserStore();
          this.rowData.HandlerName = userStore.user?.StaffName || '';
        }
        getGoBackFun();
      };

      MpMessage.success('处理成功', cb, cb);
    }
  }
}
