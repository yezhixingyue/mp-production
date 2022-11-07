import { EducationEnum, SexEnum, StaffStatusEnum } from './enums';

/**
 * 获取员工列表数据的条件类
 *
 * @export
 * @class StaffListContion
 */
export class StaffListCondition {
  FieldType = 3

  Page = 1

  PageSize = 20

  Sex: '' | SexEnum = '' // 性别

  Education: '' | EducationEnum = '' // 学历

  Status: '' | StaffStatusEnum = '' // 账号状态

  Location: { First: '' | number, Second: '' | number } = { // 省 市
    First: '',
    Second: '',
  }

  Department: { FirstDepartmentID: '' | number, SecondDepartmentID: '' | number, ThirdDepartmentID: '' | number } = { // 管理部门
    FirstDepartmentID: '',
    SecondDepartmentID: '',
    ThirdDepartmentID: '',
  }

  PositionID = '' // 岗位

  KeyWords = '' // 关键字搜索
}
