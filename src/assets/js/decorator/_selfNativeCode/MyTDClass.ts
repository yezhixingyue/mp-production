import { EducationEnum, SexEnum, StaffStatusEnum } from '@/views/companyManage/StaffManage/js/enums';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import {
  Is, Length, NotEmpty, validate,
} from './decorator';

// NextWorkingListDialog 中 有调用注释

// @validate
export class MyTDClass {
  StaffID = '';

  @NotEmpty({ msg: '姓名不能为空' })
  @Length({ min: 1, max: 10, msg: '姓名长度最多10位' })
  StaffName = '张三';

  Sex = SexEnum.male;

  Status = StaffStatusEnum.pending;

  @NotEmpty({ msg: '手机号码不能为空' })
  @Is({ msg: '手机号码格式不正确', reg: /^1[3|5|6|7|8|9]\d{9}$/ })
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

  _validate(this: MyTDClass): string[] { // 限制this指向 -- 添加此方法仅为告诉ts
    // if (this._validate) { // 如果装饰器附加了_validate方法的话 则调用并返回其结果
    //   return this._validate(obj);
    // }

    return validate(this);
  }
}

// -------------------------------- class-validator库

// import "reflect-metadata";
// import { IsNotEmpty, validate, MinLength, MaxLength, Min, Max } from "class-validator"

// class RegUser {
//     @IsNotEmpty({ message: "账号不可以为空" })
//     @MinLength(5, { message: "账号必须至少有5个字符" })
//     @MaxLength(12, { message: "账号最多12个字符" })
//     loginId: string

//     loginPwd: string

//     @Min(0, { message: "年龄的最小值是0" })
//     @Max(100, { message: "年龄的最大值是100" })
//     age: number
//     gender: "男" | "女"
// }

// const post = new RegUser();
// post.loginId = "22";
// post.age = -1;

// validate(post).then(errors => {
//     console.log(errors);
// })

// -------------------------------- class-transformer库

// import { plainToClass, Type } from "class-transformer"
// import axios from "axios"

// class User {
//     id: number
//     firstName: string
//     lastName: string

//     @Type(() => Number)
//     age: number

//     getName() {
//         return this.firstName + " " + this.lastName;
//     }

//     isAdult() {
//         return this.age > 36 && this.age < 60;
//     }
// }

// axios.get("https://api.myjson.com/bins/1b59tw").then(resp => resp.data)
//   .then(users => {
//       const us = plainToClass(User, users);
//       for (const u of us) {
//           console.log(typeof u.age, u.age);
//       }
//   })
