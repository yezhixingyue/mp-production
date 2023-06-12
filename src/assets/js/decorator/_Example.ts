/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { EducationEnum, SexEnum, StaffStatusEnum } from '@/views/companyManage/StaffManage/js/enums';
import {
  IsNotEmpty, Matches, MaxLength,
} from 'class-validator';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { BaseDecorator } from './BaseDecorator';

/**
 * ------------------------------ 装饰器模式使用示例
 */

const propDecorator = (target: any, propertyName: string) => { // 属性装饰器 --- 属性和方法装饰器中的target：如果是静态属性则为类本身；如果是实例属性，则为类的原型
  console.log(target === Example.prototype, propertyName);
};

const methodDecorator = (target: any, propertyName: string, descriptor: PropertyDescriptor) => { // 方法装饰器
  descriptor.value = () => { // 方法装饰器可以对方法进行拦截或修改等操作
    console.warn(`${propertyName}方法已过期`);
  };
};

const classDecorator = (target: new (...args: any[]) => object) => { // 类装饰器 -- 类装饰器中的target：为类本身（构造函数本身）
  console.log('classDecorator', target === Example);

  // target.prototype.validate = () => {

  // };
};

@classDecorator
export class Example extends BaseDecorator {
  @propDecorator
  ID = '';

  @methodDecorator
  sayHello() {
    console.log('sayHello', this.Mobile);
  }

  @IsNotEmpty({ message: '姓名不能为空' })
  @MaxLength(10, { message: '姓名长度最多10位' })
  StaffName = '';

  Sex = SexEnum.male;

  Status = StaffStatusEnum.pending;

  @IsNotEmpty({ message: '手机号码不能为空' })
  @Matches(/^1[3|5|6|7|8|9]\d{9}$/, { message: '手机号码格式不正确' })
  Mobile = '13500002';

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
}

/** 外部使用示例： */
// const example = new Example();

// example.Sex = 2;
// // ... 其它改动

// console.log(example, await example._validate());
