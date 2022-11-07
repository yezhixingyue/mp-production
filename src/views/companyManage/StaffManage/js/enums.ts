import { getEnumList } from '@/assets/js/utils/getListByEnums';

export enum SexEnum {
  /** 男 */
  male = 1,
  /** 女 */
  female = 2,
}

/**
 * 学历枚举
 *
 * @export
 * @enum {number}
 */
export enum EducationEnum {
  /** 大专 */
  AssociateDegree = 0,
  /** 本科 */
  university = 1,
  /** 硕士 */
  masterDegree = 2,
  /** 博士 */
  doctorDegree = 3,
  /** 其它 */
  other = 4,
}

/**
 * 员工审核状态枚举
 *
 * @export
 * @enum {number}
 */
export enum StaffStatusEnum {
  /** 待审核 */
  pending = 1,
  /** 审核通过 */
  approved = 2,
  /** 离职 */
  leaved = 3,
}

export const SexEnumObj = {
  male: {
    ID: SexEnum.male,
    Name: '男',
  },
  female: {
    ID: SexEnum.female,
    Name: '女',
  },
};

export const EducationEnumObj = {
  AssociateDegree: {
    ID: EducationEnum.AssociateDegree,
    Name: '大专',
  },
  university: {
    ID: EducationEnum.university,
    Name: '本科',
  },
  masterDegree: {
    ID: EducationEnum.masterDegree,
    Name: '硕士',
  },
  doctorDegree: {
    ID: EducationEnum.doctorDegree,
    Name: '博士',
  },
  other: {
    ID: EducationEnum.other,
    Name: '其它',
  },
};

export const StaffStatusEnumObj = {
  pending: {
    ID: StaffStatusEnum.pending,
    Name: '待审核',
  },
  approved: {
    ID: StaffStatusEnum.approved,
    Name: '审核通过',
  },
  leaved: {
    ID: StaffStatusEnum.leaved,
    Name: '离职',
  },
};

export const SexEnumList = getEnumList(SexEnumObj);
export const StaffStatusEnumList = getEnumList(StaffStatusEnumObj);
export const EducationEnumList = getEnumList(EducationEnumObj);
