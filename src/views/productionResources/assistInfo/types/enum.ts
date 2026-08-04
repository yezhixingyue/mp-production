/** 辅助信息类型枚举 */
export enum AssistInfoTypeEnum {
  /** 文件 */
  file = 0,
  /** 文字信息 */
  text = 1,
  /** 数值 */
  numerical = 2,
}

/** 辅助信息类型枚举列表 */
export const AssistInfoTypeEnums = {
  file: {
    ID: AssistInfoTypeEnum.file,
    Name: '文件',
  },
  text: {
    ID: AssistInfoTypeEnum.text,
    Name: '文字信息',
  },
  numerical: {
    ID: AssistInfoTypeEnum.numerical,
    Name: '数值',
  },
};
