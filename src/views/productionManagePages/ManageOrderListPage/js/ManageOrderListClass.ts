import api from '@/api';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { IFactoryMaterialList } from '../../ManualOrderHandlerPage/js/types';
import { Condition } from './Condition';
import { IManageOrderListItem } from './type';

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
    console.log('handleOrderToTop', id, t);
  }
}
