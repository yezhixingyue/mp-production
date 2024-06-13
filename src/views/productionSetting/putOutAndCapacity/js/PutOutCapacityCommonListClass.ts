/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { getGoBackFun } from '@/router';
import { IResponseType, IMpzjResponse } from '@/basic/request/request-lib/core/types';
import { EquipmentListType } from './types';

interface IGetPropertyListParams {
  UseModule: UseModuleEnum,
  EquipmentGroupID: string
}

export abstract class PutOutCapacityCommonListClass<T extends ConditionItemClass> {
  list: T[] = []

  /** 当前设备 */
  curLineEquipment: null | EquipmentListType = null

  /** 当前正在编辑的条件列表条目 */
  curConditionRow: null | TransformConstraintTableItemType<T> = null

  PropertyList: PropertyListItemType[] = []

  abstract getListFunc:(lineEquipmentID: string) => Promise<IResponseType<IMpzjResponse<any>> | null>

  abstract removeFunc:(id: number) => Promise<IResponseType<IMpzjResponse<any>> | null>

  abstract saveFunc:(data: T) => Promise<IResponseType<IMpzjResponse<string>> | null>

  abstract getPropertyListParams: IGetPropertyListParams

  constructor(LineEquipment: EquipmentListType) { // 后续可提出内容： 获取列表函数，usemodule, 删除方法  提取到抽象函数中？ 后面考虑该方式
    this.curLineEquipment = LineEquipment;
  }

  /** 当前工序，仅生产线和组合生产线使用 */
  curWork: { ID: string, Name: string } | null = null;

  curLineName = ''

  getInitData(curWork: { ID: string, Name: string } | null = null, lineName = '') {
    this.curWork = curWork;
    this.curLineName = lineName;
    this.getList();
    this.getPropertyList();
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

  private async getList() {
    if (!this.curLineEquipment) return;
    const resp = await this.getListFunc(this.curLineEquipment.LineEquipmentID || '');
    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data as T[];
    }
  }

  private async getPropertyList() {
    if (!this.curLineEquipment) return;
    const temp = {
      ...this.getPropertyListParams,
      WorkingID: this.curWork?.ID || '',
    };
    const resp = await api.propertyApis.getPropertyList(temp);
    if (resp.data?.isSuccess) {
      this.PropertyList = resp.data.Data || [];
    }
  }
}
