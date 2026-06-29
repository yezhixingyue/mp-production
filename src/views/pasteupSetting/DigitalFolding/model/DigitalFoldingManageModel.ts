import api from '@/api';
import { DigitalFoldItemModel } from './DigitalFoldItemModel';

/** 数码折手设置模块管理类 */
export class DigitalFoldingManageModel {
  list: DigitalFoldItemModel[] = []

  loading = false

  async getList() {
    this.loading = true;
    const resp = await api.getFoldingTemplateDigitalList();
    this.loading = false;

    if (resp.data?.isSuccess) {
      this.list = resp.data.Data.map(it => new DigitalFoldItemModel(it));
    }
  }

  async remove(item: DigitalFoldItemModel) {
    if (item.rawData) {
      const resp = await api.getFoldingTemplateDigitalRemove(item.rawData.ID);
      if (!resp.data?.isSuccess) return false;
    }

    this.list = this.list.filter(it => it.key !== item.key);

    return true;
  }
}
