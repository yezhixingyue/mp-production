/* eslint-disable @typescript-eslint/no-non-null-assertion */

import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { IPartialToolsStaff } from '../hooks/useStaffList';
import { ComputerUseStateEnum } from '../types/enum';

export class Condition {
  Page = 1

  PageSize = 20

  Keywords = ''

  State: '' | ComputerUseStateEnum = ''

  DepartmentID: '' | number = ''

  getParams(staffList: IPartialToolsStaff[]) {
    const getStaffIds = () => {
      if (typeof this.DepartmentID === 'number') {
        const ids = staffList
          .filter(staff => staff.PositionList.map(p => p.First.FirstDepartmentID).includes(this.DepartmentID as number))
          .map(staff => staff.StaffID);

        return ids;
      }

      return null;
    };

    const temp = {
      offset: this.Page,
      limit: this.PageSize,
      state: this.State || this.State === 0 ? this.State : undefined,
      keywords: this.Keywords || undefined,
      staffIds: getStaffIds() || undefined,
    };

    let _arr = temp.keywords ? staffList.filter(it => it.StaffName === temp.keywords?.trim()).map(it => it.StaffID) : undefined;
    if (_arr && _arr.length) {
      if (temp.staffIds) {
        _arr = _arr.filter(id => temp.staffIds!.includes(id));
      }

      if (_arr.length) {
        temp.staffIds = _arr;
        delete temp.keywords;
      }
    }

    return temp;
  }

  setConditon(e: ISetConditionParams) {
    return CommonClassType.setCondition(e, this);
  }
}
