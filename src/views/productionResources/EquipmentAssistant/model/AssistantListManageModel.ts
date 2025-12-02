import api from '@/api';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { IAssistantInfo, IAssistantType } from '../types/types';
import { Condition } from './Condition';
import { ItemUpsertForm } from './ItemUpsertForm';

/** 助手模块管理类 */
export class AssistantListManageModel {
  condition = new Condition()

  list: IAssistantInfo[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new Condition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    const temp = this.condition.filter();
    this.loading = true;
    const resp = await api.getAssistantList(temp);
    this.loading = false;

    if (resp.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 新增|编辑 */
  async upsert(data: ItemUpsertForm, StaffName: string) {
    const resp = await api.getAssistantSave(data);
    if (resp.data?.isSuccess) {
      const _localDate = getTimeConvertFormat({ withHMS: true });

      if (data.ID === '') { // 新增
        this.list.unshift({
          ...data,
          ID: resp.data.Data,
          OperatorName: StaffName,
          EditTime: _localDate,
          CreateTime: _localDate,
        });
        this.listNumber += 1;
      } else { // 编辑
        const i = this.list.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          this.list.splice(i, 1, {
            ...this.list[i],
            ...data,
            OperatorName: StaffName,
            EditTime: _localDate,
          });
        }
      }

      return true;
    }

    return false;
  }

  /** 项目删除 */
  async remove(row: IAssistantInfo) {
    const resp = await api.getAssistantRemove(row.ID);
    if (resp.data?.isSuccess) {
      this.list = this.list.filter(it => it.ID !== row.ID);
      this.listNumber -= 1;

      return true;
    }

    return false;
  }

  /** 助手类型列表 */
  AssistantTypeList: IAssistantType[] = []

  /** 获取助手类型列表数据 */
  async getAssistantTypeList() {
    const resp = await api.getAssistantTypeList();
    if (resp.data?.isSuccess) {
      this.AssistantTypeList = resp.data.Data;
    }
  }
}
