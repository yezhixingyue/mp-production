/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { getGoBackFun } from '@/router';
import { IFormulaParams } from '@/components/Formula/types/types';
import { IResponseType, IMpzjResponse } from '@/basic/request/request-lib/core/types';
import { EquipmentListType } from './types';

export abstract class PutOutCapacityCommonListClass<T extends ConditionItemClass> {
  list: T[] = []

  /** 当前设备 */
  curLineEquipment: null | EquipmentListType = null

  /** 当前正在编辑的条件列表条目 */
  curConditionRow: null | TransformConstraintTableItemType<T> = null

  PropertyList: PropertyListItemType[] = []

  FormulaPropertyList: PropertyListItemType[] = []

  abstract getListFunc:(data: IFormulaParams | string[]) => Promise<IResponseType<IMpzjResponse<any>> | null>

  abstract removeFunc:(id: number | string) => Promise<IResponseType<IMpzjResponse<any>> | null>

  abstract saveFunc:(data: T) => Promise<IResponseType<IMpzjResponse<string>> | null>

  abstract UseModule: UseModuleEnum

  FormulaUseModule?: UseModuleEnum

  constructor(LineEquipment: EquipmentListType, FormulaUseModule?: UseModuleEnum) { // 后续可提出内容： 获取列表函数，usemodule, 删除方法  提取到抽象函数中？ 后面考虑该方式
    this.curLineEquipment = LineEquipment;
    this.FormulaUseModule = FormulaUseModule;
  }

  /** 当前工序，仅生产线和组合生产线使用 */
  curWork: { ID: string, Name: string } | null = null;

  curLineName = ''

  EquipmentData: null | { curEquipID: null | string; EquipmentList: EquipmentListType[] } = null

  // eslint-disable-next-line max-len
  getInitData(curWork: { ID: string, Name: string } | null = null, lineName = '', data: { curEquipID: null | string; EquipmentList: EquipmentListType[] } | null = null) {
    this.curWork = curWork;
    this.curLineName = lineName;
    this.EquipmentData = data;

    console.log('getInitData:', data);

    this.getList();
    this.getPropertyList();
    // this.getFormulePropertyList();
  }

  /** 为null时为新增 */
  setCurConditionRow(item: null | TransformConstraintTableItemType<T>) {
    this.curConditionRow = item;
  }

  async handleItemSave(item: T) {
    const resp = await this.saveFunc(item).catch(() => null);
    if (resp?.data?.isSuccess) {
      const isEdit = !!item.ID;
      const cb = () => {
        // 处理数据变动
        if (!isEdit) {
          const ID = resp.data && /^\d+$/.test(`${resp.data.Data}`) ? +resp.data.Data : resp.data?.Data;
          this.list.unshift({ ...item, ID });
        } else {
          const i = this.list.findIndex(it => it.ID === item.ID);
          if (i > -1) {
            this.list.splice(i, 1, item);
          }
        }
        // 返回上一页
        getGoBackFun();
      };
      MpMessage.success({
        title: isEdit ? '编辑成功' : '添加成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  async handleItemRemove(item: T) {
    if (!item.ID && item.ID !== 0) return;
    const resp = await this.removeFunc(item.ID).catch(() => null);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        const i = this.list.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          this.list.splice(i, 1);
        }
      };
      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  }

  handleImported(newConditionList: T[]) {
    this.list = [...newConditionList];
    // this.getList();
  }

  private async getList() {
    if (!this.curLineEquipment) return;

    const params = typeof this.FormulaUseModule === 'number' ? {
      UseModule: this.FormulaUseModule,
      PositionID: this.curLineEquipment.LineEquipmentID || '',
      WorkingID: this.curWork?.ID || '',
    } : [this.curLineEquipment.LineEquipmentID || ''];

    const resp = await this.getListFunc(params);

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data as T[];
    }
  }

  private async getPropertyList() {
    if (!this.curLineEquipment) return;

    const temp = {
      UseModule: this.UseModule,
      WorkingID: this.curWork?.ID || '',
      EquipmentGroupID: this.curLineEquipment.GroupID,
    };

    const resp = await api.propertyApis.getPropertyList(temp);

    if (resp.data?.isSuccess) {
      this.PropertyList = resp.data.Data || [];
    }
  }
}
