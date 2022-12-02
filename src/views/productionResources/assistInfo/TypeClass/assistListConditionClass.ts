import { localEnumValueIDType } from '@/assets/js/utils/getListByEnums';

export enum AssistInfoTypeEnum {
  file = 0,
  text = 1,
  numerical = 2,
}

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

export class AssistListConditionClass {
  Type: localEnumValueIDType = ''

  Page = 1

  PageSize = 20
}
