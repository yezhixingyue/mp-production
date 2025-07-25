import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun, router } from '@/router';
import { RemovePrivateProperties } from '@/types/types';
import { useUserStore } from '@/store/modules/user';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { TCraftResolveDetail, IPDOrderItem } from '../../../types/types';
import { PDOCraftResolveForm, TPDOCraftResolveForm } from './ruleForm';
import { TProductionLineListData } from '../../../js/getProductionLineList';
import { PDOStatusEnum } from '../../../types/enum';
import { PDOListManageStore } from '../../../store';

export class PDOSetupClass {
  rowItem: IPDOrderItem

  /** 生产线列表数据 */
  lineListData: TProductionLineListData

  craftResolveDetail: null | TCraftResolveDetail = null

  ruleForm: TPDOCraftResolveForm | null = null

  constructor(row: IPDOrderItem, lineListData: TProductionLineListData) {
    this.rowItem = row;
    this.lineListData = lineListData;
  }

  detailData4Submit: null | TCraftResolveDetail = null

  /** 是否可提交与保存 */
  get disabled() {
    return !(this.ruleForm?.InstanceList.length !== 0 && this.ruleForm?.InstanceList.every(ins => ins.WorkingList.length > 0));
  }

  private async _getCraftResolveDetail() {
    if (!this.rowItem.HaveDetail) {
      return;
    }

    const resp = await api.productionManageApis.getCraftResolveDetail(this.rowItem.ID);

    if (resp.data?.isSuccess) {
      this.craftResolveDetail = resp.data.Data;
    }
  }

  /** 初始化表单等相关数据 */
  async initial(detailData?: TCraftResolveDetail) {
    if (!detailData) {
      await this._getCraftResolveDetail();
    } else {
      this.craftResolveDetail = detailData;
      this.detailData4Submit = null;
    }

    this.ruleForm = new PDOCraftResolveForm(LineTypeEnum.normal, this.rowItem.ID); // 此处LineTypeEnum.normal后续需要区分

    if (this.craftResolveDetail) {
      this.ruleForm.restore({ detail: this.craftResolveDetail, lineListData: this.lineListData });
    }
  }

  onTypeChange(type: LineTypeEnum) {
    this.ruleForm = new PDOCraftResolveForm(type, this.rowItem.ID);
  }

  /** 保存|提交后对列表项数据的更改 */
  private _changeRowStateAfterRequest(type: 'save' | 'submit') {
    const t = PDOListManageStore.value?.list.find(it => it.ID === this.rowItem.ID);
    if (t) {
      t.Status = type === 'save' ? PDOStatusEnum.pending : PDOStatusEnum.finish;

      const _detailInstanceList = type === 'save' ? this.ruleForm?.InstanceList : this.detailData4Submit?.InstanceList;
      const _list = _detailInstanceList?.map(it => it.LineList?.[0]?.Name as string).filter(Boolean) || [];
      t.LineList = [...new Set(_list)];

      const userStore = useUserStore();
      const { user } = userStore;
      t.Operator = user?.StaffName || '';

      t.HaveDetail = true;
    }
  }

  /** 保存返回 | 下一步 */
  async save(IsUploadFile: boolean) {
    if (!this.ruleForm) return;

    const params = await this.ruleForm.getParams(IsUploadFile);
    if (!params) return;

    const resp = await api.productionManageApis.getCraftResolveSave(params);
    if (resp.data?.isSuccess) {
      if (!IsUploadFile) {
        const cb = () => {
          this._changeRowStateAfterRequest('save');

          getGoBackFun();
        };

        MpMessage.success('保存成功', cb, cb);
      } else {
        // 1. 记录数据并翻页
        this.detailData4Submit = resp.data.Data;
        router.push('/ProcessDecompositionOrderSubmit');

        // 2. 提示
        // ElMessage({
        //   showClose: true,
        //   message: '设置成功',
        //   type: 'success',
        // });
      }
    }
  }

  /** 最终提交 */
  async submit() {
    if (!this.detailData4Submit) return;

    const resp = await api.productionManageApis.getCraftResolveSubmit(this.detailData4Submit.ID);
    if (resp.data?.isSuccess) {
      const cb = () => {
        this._changeRowStateAfterRequest('submit');

        router.replace('/ProcessDecompositionOrderList');
      };
      MpMessage.success('提交成功', cb, cb);
    }
  }

  /** 从最终返回至第二步 */
  back() {
    if (!this.ruleForm || !this.detailData4Submit) return;

    this.initial(this.detailData4Submit);

    getGoBackFun();
  }
}

export type TPDOSetupClass = RemovePrivateProperties<PDOSetupClass>
