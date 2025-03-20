import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { ElMessage } from 'element-plus';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { ProductLineSimpleType } from '../../ManualOrderHandlerPage/js/types';
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

  /** 设置条件 */
  setCondition(e: ISetConditionParams) {
    CommonClassType.setCondition(e, this.condition);
  }

  clearCondition() {
    this.condition = new Condition();
  }

  /** 生产线 暂定不包含组合生产线 */
  ProductionLineList: Pick<ProductLineSimpleType, 'ID' | 'Name'>[] = []

  private async getProductionLineList() {
    if (this.ProductionLineList.length > 0) return;
    const resp = await api.getProductionLineAll().catch(() => null);
    if (resp?.data?.isSuccess) {
      const list = (resp.data.Data as ProductLineSimpleType[]).filter(it => it.Type === LineTypeEnum.normal);
      this.ProductionLineList = [{ ID: '', Name: '所有生产线' }, ...list];
    }
  }

  /** 获取列表数据 */
  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    CommonClassType.setDate(this.condition, 'CreateTime');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp = CommonClassType.filter(this.condition, true) as any;

    if (temp.UnImposition === false) delete temp.UnImposition;

    this.loading = true;
    const resp = await api.productionManageApis.getOrderList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  getInitData() {
    this.getList();
    this.getProductionLineList();
  }

  /** 订单置顶 */
  async handleOrderToTop(id: string) {
    const t = this.list.find(it => it.ID === id);
    if (!t) return;

    const resp = await api.productionManageApis.getOrderPushTop(id).catch(() => null);

    if (resp?.data?.isSuccess) {
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

    if (resp?.data?.isSuccess) {
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

  /** 转自定义版 */
  async handleToCustomizPlate(id: string) {
    const t = this.list.find(it => it.ID === id);
    if (!t) return;

    const resp = await api.productionManageApis.getOrderToCustomPlate(id);

    if (resp?.data?.isSuccess) {
      const cb = () => {
        t.ToCustomPlate = false;
      };
      MpMessage.success('转版成功', cb, cb);
    }
  }
}
