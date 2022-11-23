import { getEnumList } from '@/assets/js/utils/getListByEnums';

/* 报工方式枚举相关
-------------------------------------- */
export enum ReportModeEnum {
  /** 块报工 */
  block = 0,
  /** 大版报工 */
  board = 1,
  /** 订单报工 */
  order = 2,
}

/**
 * 报工方式
 */
export const ReportModeEnumObj = {
  block: {
    ID: ReportModeEnum.block,
    Name: '块报工',
  },
  board: {
    ID: ReportModeEnum.board,
    Name: '大版报工',
  },
  order: {
    ID: ReportModeEnum.order,
    Name: '订单报工',
  },
};

/** 报工方式枚举列表 */
export const ReportModeEnumList = getEnumList(ReportModeEnumObj);

/* 工序类型枚举相关
-------------------------------------- */
export enum ProcessTypeEnum {
  /** 普通工序  */
  normal = 0,
  /** 印刷工序 */
  print = 1,
  /** 制版工序 */
  platemaking = 2,
  /** 组合工序 */
  combine = 3,
  /** 拆分工序 */
  split = 4,
}

/**
 * 工序类型枚举
 */
export const ProcessTypeEnumObj = {
  normal: {
    ID: ProcessTypeEnum.normal,
    Name: '普通工序',
  },
  print: {
    ID: ProcessTypeEnum.print,
    Name: '印刷工序',
  },
  platemaking: {
    ID: ProcessTypeEnum.platemaking,
    Name: '制版工序',
  },
  combine: {
    ID: ProcessTypeEnum.combine,
    Name: '组合工序',
  },
  split: {
    ID: ProcessTypeEnum.split,
    Name: '拆分工序',
  },
};

/** 工序类型枚举列表 */
export const ProcessTypeEnumList = getEnumList(ProcessTypeEnumObj);

/* 大版类型枚举相关（ 目前仅制版工序中使用到 ）
-------------------------------------- */
export enum TemplateTypeEnum {
  /** 印刷版 */
  print = 1,
  /** 其它 */
  other = 2,
}

export const TemplateTypeEnumObj = {
  print: {
    ID: TemplateTypeEnum.print,
    Name: '印刷版',
  },
  other: {
    ID: TemplateTypeEnum.other,
    Name: '其它',
  },
};

/** 大版类型枚举列表 （ 制版工序 ） */
export const TemplateTypeEnumList = getEnumList(TemplateTypeEnumObj);

/* 工序中资源类型 Relations 中的 Type
-------------------------------------- */
export enum WorkingProcedureRelationEnum {
  /** 辅助信息 */
  assets = 0,
  /** 可选物料资源包 */
  material = 1,
  /** 其他大版文件(大版类型为其他情况) */
  otherBoard = 2,
}
