import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ElMessage } from 'element-plus';
import { IFactoryMaterialList } from '../../ManualOrderHandlerPage/js/types';
import { Condition } from './Condition';
import { IManageOrderListItem, IOrderCancelRelation } from './type';
import { OrderStatus } from './enum';

export class ManageOrderListClass {
  /** 获取订单列表的条件信息 */
  condition = new Condition()

  /** 订单列表数据 */
  list: IManageOrderListItem[] = []

  /** 订单列表条目数 */
  listNumber = 0

  /** 是否正在加载中 */
  loading = false

  MaterialList: IFactoryMaterialList[] = []

  /** 设置条件 */
  setCondition(e: ISetConditionParams) {
    CommonClassType.setCondition(e, this.condition);
  }

  clearCondition() {
    this.condition = new Condition();
  }

  private async getMaterialList() {
    if (this.MaterialList.length > 0) { // 已经获取过
      return;
    }
    const resp = await api.ManualOrderHandlerApis.getFactoryMaterialList().catch(() => null);
    if (resp?.data.isSuccess) {
      this.MaterialList = resp.data.Data;
    }
  }

  /** 获取列表数据 */
  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    CommonClassType.setDate(this.condition, 'CreateTime');
    const temp = CommonClassType.filter(this.condition, true);

    this.loading = true;
    const resp = await api.productionManageApis.getOrderList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  getInitData() {
    this.getList();
    this.getMaterialList();
  }

  /** 订单置顶 */
  async handleOrderToTop(id: string) {
    const t = this.list.find(it => it.ID === id);
    if (!t) return;

    const resp = await api.productionManageApis.getOrderPushTop(id).catch(() => null);

    if (resp?.data.isSuccess) {
      const cb = () => {
        t.IsTop = true;
      };

      MpMessage.dialogSuccess('置顶成功', cb, cb);
    }
  }

  /** 订单取消 */
  async handleOrderCancel(ruleForm: IOrderCancelRelation, callback: () => void) { // getOrderCancle
    const t = this.list.find(it => it.ID === ruleForm.ID);
    if (!t) return;

    const resp = await api.productionManageApis.getOrderCancle(ruleForm).catch(() => null);

    if (resp?.data.isSuccess) {
      if (ruleForm.PlateList.length > 0) {
        ElMessage({
          showClose: true,
          message: '取消成功',
          type: 'success',
        });
        t.Status = OrderStatus.HaveCancled;
        callback();
      } else {
        const cb = () => {
          t.Status = OrderStatus.HaveCancled;
          callback();
        };
        MpMessage.success('取消成功', cb, cb);
      }
    }
  }
}
