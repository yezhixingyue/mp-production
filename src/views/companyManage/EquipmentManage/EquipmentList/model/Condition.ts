/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { IPartialToolsStaff } from '../hooks/useStaffList';
import { EquipmentStatusEnum, EquipmentTypeEnum } from '../types/enum';

export class Condition {
  Page = 1

  PageSize = 20

  Type: '' | EquipmentTypeEnum = ''

  Keywords = ''

  Status: '' | EquipmentStatusEnum = ''

  DepartmentID: '' | number = ''

  PostID = ''

  getParams(staffList: IPartialToolsStaff[]) {
    const getStaffIds = () => {
      if (typeof this.DepartmentID !== 'number' && !this.PostID) return null;

      let _staffList = staffList;
      let screeningGroup = false; // 是否筛选部门或岗位

      if (typeof this.DepartmentID === 'number') {
        _staffList = _staffList.filter(staff => staff.PositionList.map(p => p.First.FirstDepartmentID).includes(this.DepartmentID as number));
        screeningGroup = true;
      }

      if (this.PostID) {
        _staffList = _staffList.filter(staff => staff.PositionList.map(p => p.Second.PositionID).includes(this.PostID));
        screeningGroup = true;
      }

      return { staffIds: _staffList.map(staff => staff.StaffID), screeningGroup };
    };

    const { staffIds, screeningGroup } = getStaffIds() || {};

    const temp = {
      Page: this.Page,
      PageSize: this.PageSize,
      status: this.Status || this.Status === 0 ? this.Status : undefined,
      type: this.Type || this.Type === 0 ? this.Type : undefined,
      keywords: this.Keywords || undefined,
      staffIds: staffIds || undefined,
      screeningGroup: screeningGroup || false, // 是否筛选部门或岗位
    };

    let _arr = temp.keywords ? staffList.filter(it => it.StaffName.includes(temp.keywords!.trim())).map(it => it.StaffID) : undefined;
    if (_arr && _arr.length) {
      if (temp.staffIds) {
        _arr = _arr.filter(id => temp.staffIds!.includes(id));
      }

      if (_arr.length) {
        temp.staffIds = _arr;
        // delete temp.keywords;
      }
    }

    return temp;
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
