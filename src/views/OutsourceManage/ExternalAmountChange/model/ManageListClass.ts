import api from '@/api';
import { ElMessage } from 'element-plus';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { Condition } from './Condition';
import { ITaskPriceCheckInfo } from '../types/type';
import { RuleForm } from './ruleForm';
import { PageMoudleManageClass } from './PageMoudleManageClass';
import { TaskPriceCheckStatusEnum } from '../types/enum';

export class ManageListClass {
  condition = new Condition()

  list: ITaskPriceCheckInfo[] = []

  listNumber = 0

  loading = false

  async getList(Page = 1) {
    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();

    const resp = await api.outsourceApis.getExternalFactoryPriceCheckList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  clearCondition() {
    this.condition = new Condition();
  }

  async remove(id: number) {
    const resp = await api.outsourceApis.getExternalFactoryChangePriceRemove(id);
    if (resp?.data?.isSuccess) {
      ElMessage.success('删除成功');
      this.list = this.list.filter(it => it.ID !== id);
      this.listNumber -= 1;
    }
  }

  /** 修改价格 */
  async changePrice(data: ReturnType<RuleForm['getParams']>, staffList: PageMoudleManageClass['StaffList']) {
    const resp = await api.outsourceApis.getExternalFactoryChangePriceChange(data);
    if (resp.data?.isSuccess) {
      const target = this.list.find(it => it.ID === data.ID);
      if (target) { // 行数据修改
        // 1. 修改价格
        target.ChangePrice = typeof data.Price === 'number' ? data.Price : null;

        // 2. 修改：金额说明 审核主管
        target.ChangeRemark = data.Remark || '';

        const manager = staffList.find(it => it.StaffID === data.ManagerID);
        target.ManagerID = manager?.StaffID || '';
        target.ManagerName = manager?.StaffName || '';

        // 3. 修改状态： 待主管审核 或 待财务确认
        target.Status = data.ManagerID ? TaskPriceCheckStatusEnum.HaveChangePrice : TaskPriceCheckStatusEnum.WaitCheck;
      }

      return true;
    }

    return false;
  }

  /** 主管审核 */
  async managerCheck(data: ReturnType<RuleForm['getParams']>, staffList: PageMoudleManageClass['StaffList']) {
    const resp = await api.outsourceApis.getExternalFactoryChangePriceManagerCheck(data);
    if (resp.data?.isSuccess) {
      const target = this.list.find(it => it.ID === data.ID);
      if (target) { // 行数据修改
        // 一、 转给其他主管
        if (data.IsRefused === undefined) { // 修改审核主管人
          const manager = staffList.find(it => it.StaffID === data.ManagerID);
          target.ManagerID = manager?.StaffID || '';
          target.ManagerName = manager?.StaffName || '';

          return true;
        }

        // 二、 审核通过或不通过
        // 1. 修改状态： 未通过 或 待财务确认
        target.Status = data.IsRefused ? TaskPriceCheckStatusEnum.Refuse : TaskPriceCheckStatusEnum.WaitCheck;
        // 2. 主管驳回
        target.IsManagerRefuse = data.IsRefused;
      }

      return true;
    }

    return false;
  }

  /** 财务确认 */
  async confirm(data: ReturnType<RuleForm['getParams']>, RecheckOperatorName: string) {
    const resp = await api.outsourceApis.getExternalFactoryChangePriceRecheck(data);
    if (resp.data?.isSuccess) {
      const target = this.list.find(it => it.ID === data.ID);
      if (target) { // 行数据修改
        // 1. 修改状态 确认时间 确认人 是否主管驳回
        target.Status = data.IsRefused ? TaskPriceCheckStatusEnum.Refuse : TaskPriceCheckStatusEnum.HaveChecked; // 修改状态： 未通过 或 已确认
        target.RecheckTimer = getTimeConvertFormat({ withHMS: true });
        target.RecheckOperatorName = RecheckOperatorName;
        target.IsManagerRefuse = false;

        // 2. 驳回时 调整复核意见
        if (data.IsRefused) {
          target.RecheckRemark = data.Remark || '';
        }
      }

      return true;
    }

    return false;
  }

  /** 导出Excel成功后的处理 */
  handleImported() {
    this.clearCondition();
    this.getList();
  }
}
