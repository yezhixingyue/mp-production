import { EducationEnum, SexEnum, StaffStatusEnum } from '@/views/companyManage/StaffManage/js/enums';
import {
  IsNotEmpty, Matches, MaxLength, validate, ValidationError,
} from 'class-validator';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';

export class ValidatorTDClass {
  StaffID = '';

  @IsNotEmpty({ message: '姓名不能为空' })
  @MaxLength(10, { message: '姓名长度最多10位' })
  StaffName = '张三';

  Sex = SexEnum.male;

  Status = StaffStatusEnum.pending;

  @IsNotEmpty({ message: '手机号码不能为空' })
  @Matches(/^1[3|5|6|7|8|9]\d{9}$/, { message: '手机号码格式不正确' })
  Mobile = '13500002222';

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

  _validate(this: ValidatorTDClass): Promise<ValidationError[]> { // 限制this指向 -- 添加此方法仅为告诉ts
    // if (this._validate) { // 如果装饰器附加了_validate方法的话 则调用并返回其结果
    //   return this._validate(obj);
    // }

    return validate(this);
  }
}
