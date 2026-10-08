import api from '@/api';
import { IImpAllocationListItem } from '../types/types';

const formatListItem = (it: IImpAllocationListItem) => ({
  ...it,
  MemberNames: it.MemberList?.map(it => it.Name).join('，') || '',
  MaterialName: it.MaterialName || '',
});

export class ImpositionAllocationModel {
  condition = {
    LineID: '',
    KeyWords: '',
    Page: 1,
    PageSize: 20,
  }

  loading = false

  _list: (IImpAllocationListItem & { MemberNames: string })[] = []

  get filteredList() {
    return this._list.filter(it => it.MaterialName.includes(this.condition.KeyWords) || it.MemberNames.includes(this.condition.KeyWords));
  }

  get list() {
    return this.filteredList.slice((this.condition.Page - 1) * this.condition.PageSize, this.condition.Page * this.condition.PageSize);
  }

  async getList(Page = 1) {
    this.condition.Page = Page;
    if (Page > 1) return;

    this.loading = true;
    const resp = await api.productionManageApis.getImpositionPermissionList(this.condition.LineID);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this._list = (resp.data.Data as IImpAllocationListItem[]).map(formatListItem);
    }
  }

  onLineClick(LineID: string) {
    this.condition.LineID = LineID;
    this.getList();
  }

  changeKeywords(KeyWords: string) {
    this.condition.KeyWords = KeyWords;
    this.condition.Page = 1;
  }

  clearCondition() {
    this.condition.KeyWords = '';
    this.getList();
  }

  updateMemberList(data: IImpAllocationListItem) {
    const t = this._list.find(it => it.MaterialID === data.MaterialID);
    if (t) {
      const { MemberList, MemberNames } = formatListItem(data);
      t.MemberList = MemberList;
      t.MemberNames = MemberNames;
    }
  }
}
