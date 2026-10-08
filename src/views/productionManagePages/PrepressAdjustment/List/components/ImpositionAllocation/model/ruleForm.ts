import api from '@/api';
import { IImpAllocationListItem } from '../types/types';

export class ImpAllocationRuleForm {
  readonly row: IImpAllocationListItem | null

  MemberList: IImpAllocationListItem['MemberList'] = []

  currentMember = {
    ID: '',
    Name: '',
  }

  constructor(row: IImpAllocationListItem | null) {
    this.row = row;
    if (row) {
      this.MemberList = [...row.MemberList];
    }
  }

  onCurrentMemberChange(data: { StaffID: string; StaffName: string }) {
    this.currentMember.ID = data.StaffID;
    this.currentMember.Name = data.StaffName;
  }

  remove(id: string) {
    this.MemberList = this.MemberList.filter((member) => member.ID !== id);
  }

  add() {
    if (!this.currentMember.ID) return;
    if (this.MemberList.some((member) => member.ID === this.currentMember.ID)) return;

    this.MemberList.push({ ...this.currentMember });
    this.currentMember.ID = '';
    this.currentMember.Name = '';
  }

  async submit() {
    const temp = {
      ...this.row,
      MemberList: this.MemberList,
    };

    const resp = await api.productionManageApis.getImpositionPermissionSetup(temp);
    if (resp.data?.isSuccess) {
      return temp;
    }

    return null;
  }
}
