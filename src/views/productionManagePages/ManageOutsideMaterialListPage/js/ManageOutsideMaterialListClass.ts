import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { Condition } from './Condition';
import { ExternalMaterialStatusEnum } from './enum';
import { IExternalMaterialDetail } from './types';

/**
 * 类 - 管理外来物料列表
 *
 * @export
 * @class ManageOutsideMaterialListClass
 */
export class ManageOutsideMaterialListClass {
  condition = new Condition()

  list: IExternalMaterialDetail[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new Condition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();
    const resp = await api.productionManageApis.getExternalMaterialList(temp).catch(() => null);

    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 设置到货 */
  async setReceived(item: IExternalMaterialDetail) {
    const resp = await api.productionManageApis.getExternalMaterialReceived(item.ID).catch(() => null);

    if (resp?.data?.isSuccess) {
      const cb = () => {
        const t = this.list.find(it => it.ID === item.ID);
        if (t) {
          t.Status = ExternalMaterialStatusEnum.HaveDelivery;
          t.ReceiveTime = getTimeConvertFormat({ withHMS: true });
          const userStore = useUserStore();
          t.Operator = userStore.user?.StaffName || '';
        }
      };
      MpMessage.success({
        title: '到货成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}
