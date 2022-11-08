import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import { restoreInitDataByOrigin, getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { SexEnum, StaffStatusEnum, EducationEnum } from './enums';
import { getInfoFormIdCard } from './IdCardvalidator';
import { IStaff } from './types';

/**
 * 员工类
 *
 * @export
 * @class Staff
 * @implements {IStaff}
 */
export class Staff implements IStaff {
  StaffID = '';

  StaffName = '';

  Sex = SexEnum.male;

  Status = StaffStatusEnum.pending;

  Mobile = '';

  Password = '';

  Education = EducationEnum.AssociateDegree;

  IDCard = '';

  Area = {
    RegionalID: 1497,
    CityID: 1498,
  };

  DetailAddress = '';

  HeadPic = '';

  CheckUser = {
    StaffID: '',
    StaffName: '',
  };

  PositionList = [];

  TimeRecord = {
    CheckTime: '',
    RegTime: '',
    Birthday: '',
    JoinDate: getTimeConvertFormat({ withHMS: true }),
    OutTime: '',
  };

  LastLoginRecord = {
    First: '',
    Second: '',
  };

  UseIntranet = false;

  constructor(data?: IStaff) {
    if (data) restoreInitDataByOrigin(this, data);
  }

  getSubmitData() {
    // 1. 转换
    const result = getInfoFormIdCard(this.IDCard);
    if (result) {
      const { Birthday, Sex } = result;
      this.Sex = Sex;
      this.TimeRecord.Birthday = Birthday;
      // 2. 筛选
      const temp = CommonClassType.filter(this, true);
      return temp;
    }
    return null;
  }
}
